import { User } from '@models/user.model'
import {
	HttpService,
	Inject,
	Injectable,
	Logger,
	NotFoundException
} from '@nestjs/common'
import { utc } from 'moment'
import { DEFAULT_TOTAL_MASTERY_SCORE, REGION } from '../constants'
import { JsonLoaderService } from './json-loader.service'

@Injectable()
export class MasteryService {
	constructor(
		@Inject(HttpService)
		private readonly httpService: HttpService,
		@Inject(Logger)
		private readonly logger: Logger,
		private readonly jsonLoaderService: JsonLoaderService,
	) { }

	/**
	 * This method retrieves the total mastery score for a User, either from the cache
	 * or from the Riot API (across HTTP)
	 *
	 * @param apiKey String value to use when interacting w/ Riot API
	 * @param summonerId String value to use to select User (from Users file)
	 * @param defaultMasteryTotal Number to use if method is unable to
	 *   retrieve fresh mastery total (default = DEFAULT_TOTAL_MASTERY_SCORE)
	 *
	 * @returns Promise<number> If fetch is successful, the mastery total for
	 *   the User w/ the given summonerId; otherwise, the value given as defaultMasteryTotal
	 *   is returned
	 */
	getMasteryTotal(apiKey: string, summonerId: string, defaultMasteryTotal = DEFAULT_TOTAL_MASTERY_SCORE): Promise<number> {
		const loadedUsers = this.jsonLoaderService.loadUsersFromFile()
		const targetUser = loadedUsers.find(user => user.summonerId === summonerId)

		if (!targetUser) {
			this.logger.error(new NotFoundException(`User w/ summonerId="${summonerId}" was not found`))
			return Promise.resolve(defaultMasteryTotal)
		}

		if (targetUser.isFresh) {
			this.logger.log(`loaded from cache totalScore=${targetUser.masteryTotal}`, ' getMasteryTotal | match-svc ')
			return Promise.resolve(targetUser.masteryTotal)
		}

		return this.httpService.get(`https://${REGION}.api.riotgames.com/lol/champion-mastery/v4/scores/by-summoner/${summonerId}`,
			{
				headers: {
					'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
					'Accept-Language': 'en-US,en;q=0.9',
					'X-Riot-Token': apiKey
				}
			})
			.toPromise()
			.then(resp => {
				const masteryTotalScore = parseInt(resp.data, 10)

				this.logger.log(`fetched total mastery over HTTP masteryTotalScore=${masteryTotalScore}`, ' getMasteryTotal | match-svc ')

				return masteryTotalScore
			})
			.catch(err => {
				this.logger.error(`Error while fetching total mastery score!\n\n${JSON.stringify(err, null, 4)}`, ' getMasteryTotal | match-svc ')

				return defaultMasteryTotal
			})
	}

	/**
	 * This method retrieves the total mastery score for all Users using the Riot API (across HTTP)
	 *   and updates the users file with the new scores
	 *
	 * @param apiKey String value to use when interacting w/ Riot API
	 *
	 * @returns Promise<User[]> Attempt to fetch over HTTP the total mastery score for each user in
	 *   the users file; it then returns the updated Users
	 */
	refreshMasteryTotalForAllUsers(apiKey: string): Promise<User[]> {
		const loadedUsers = this.jsonLoaderService.loadUsersFromFile()

		return Promise.all(
			loadedUsers.map(user =>
				this.httpService.get(`https://${REGION}.api.riotgames.com/lol/champion-mastery/v4/scores/by-summoner/${user.summonerId}`,
					{
						headers: {
							'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
							'Accept-Language': 'en-US,en;q=0.9',
							'X-Riot-Token': apiKey
						}
					})
					.toPromise()
					.then(resp => {
						const masteryTotalScore = parseInt(resp.data, 10)
						const utcNow = utc()

						this.logger.log(`fetched total mastery over HTTP masteryTotalScore=${masteryTotalScore}`, ' refreshMasteryTotalForAllUsers | match-svc ')

						user.lastUpdated = utcNow.valueOf()
						user.masteryTotal = masteryTotalScore

						return user
					})
			))
			.then(updatedUsers => {
				this.jsonLoaderService.updateUsersFile(updatedUsers)

				return updatedUsers
			})
			.catch(err => {
				this.logger.error(`Error while updating users!\n\n${JSON.stringify(err, null, 4)}`, ' refreshMasteryTotalForAllUsers | match-svc ')

				return loadedUsers
			})
	}
}
