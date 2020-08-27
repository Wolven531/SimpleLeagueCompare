import { User } from '@models/user.model'
import {
	HttpService,
	Inject,
	Injectable,
	Logger,
	LoggerService
} from '@nestjs/common'
import { utc } from 'moment'
import {
	DEFAULT_TOTAL_MASTERY_SCORE
} from '../constants'
import { JsonLoaderService } from './json-loader.service'

const REGION = 'na1'

@Injectable()
export class MasteryService {
	constructor(
		private httpService: HttpService,
		@Inject(Logger)
		private readonly logger: LoggerService,
		private readonly jsonLoaderService: JsonLoaderService,
	) { }

	getMasteryTotal(apiKey: string, summonerId: string, defaultMasteryTotal = DEFAULT_TOTAL_MASTERY_SCORE): Promise<number> {
		const loadedUsers = this.jsonLoaderService.loadUsersFromFile()
		const targetUser = loadedUsers.find(user => user.summonerId === summonerId)

		if (targetUser && targetUser.isFresh) {
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
			.then(
				resp => {
					const masteryTotalScore = parseInt(resp.data, 10)

					this.logger.log(`fetched total mastery over HTTP masteryTotalScore=${masteryTotalScore}`, ' getMasteryTotal | match-svc ')

					return masteryTotalScore
				},
				rejectionReason => {
					this.logger.log(`Promise rejected!\n\n${JSON.stringify(rejectionReason, null, 4)}`, ' getMasteryTotal | match-svc ')

					return defaultMasteryTotal
				}
			)
			.catch(err => {
				this.logger.log(`Error while fetching total mastery score!\n\n${JSON.stringify(err, null, 4)}`, ' getMasteryTotal | match-svc ')

				return defaultMasteryTotal
			})
	}

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
				.then(
					resp => {
						const masteryTotalScore = parseInt(resp.data, 10)
						const utcNow = utc()

						this.logger.log(`fetched total mastery over HTTP masteryTotalScore=${masteryTotalScore}`, ' refreshMasteryTotalForAllUsers | match-svc ')

						user.lastUpdated = utcNow.valueOf()
						user.masteryTotal = masteryTotalScore

						return user
					},
					rejectionReason => {
						this.logger.log(`Promise rejected!\n\n${JSON.stringify(rejectionReason, null, 4)}`, ' refreshMasteryTotalForAllUsers | match-svc ')

						return user
					}
				)
				.catch(err => {
					this.logger.log(`Error while fetching total mastery score!\n\n${JSON.stringify(err, null, 4)}`, ' refreshMasteryTotalForAllUsers | match-svc ')

					return user
				})
			)
		)
			.then(updatedUsers => {
				this.jsonLoaderService.updateUsersFile(updatedUsers)

				return updatedUsers
			})
			.catch(err => {
				this.logger.log(`Error while updating users!\n\n${JSON.stringify(err, null, 4)}`, ' refreshMasteryTotalForAllUsers | match-svc ')

				return loadedUsers
			})
	}
}
