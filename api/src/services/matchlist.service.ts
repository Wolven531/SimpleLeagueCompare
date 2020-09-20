import { Game } from '@models/game.model'
import { Match } from '@models/match.model'
import { Matchlist } from '@models/matchlist.model'
import {
	HttpService,
	Inject,
	Injectable,
	Logger,
	LoggerService
} from '@nestjs/common'
import {
	DEFAULT_TOTAL_MASTERY_SCORE,
	MAX_NUM_MATCHES,
	MIN_NUM_MATCHES,
	REGION
} from '../constants'
import { JsonLoaderService } from './json-loader.service'

@Injectable()
export class MatchlistService {
	constructor(
		private readonly httpService: HttpService,
		@Inject(Logger)
		private readonly logger: LoggerService,
		private readonly jsonLoaderService: JsonLoaderService,
	) { }

	getGame(apiKey: string, gameId: number): Promise<Game | void> {
		return this.httpService.get(`https://${REGION}.api.riotgames.com/lol/match/v4/matches/${gameId}`,
			{
				headers: {
					'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
					'Accept-Language': 'en-US,en;q=0.9',
					'X-Riot-Token': apiKey,
				},
			})
			.toPromise()
			.then(resp => {
				const gameInfo: Game = resp.data

				this.logger.log(`Fetched game (id = ${gameId})! Created = ${gameInfo.gameCreation} Duration = ${gameInfo.gameDuration}`, ' getGame | match-svc ')

				return gameInfo
			})
			.catch(err => {
				this.logger.error(`Error while fetching game!\n\n${JSON.stringify(err, null, 4)}`, ' getGame | match-svc ')
			})
	}

	getMatchlist(apiKey: string, accountId: string, getLastX: number | undefined, includeGameData = false): Promise<Match[] | Game[]> {
		return this.httpService.get(`https://${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}`,
			{
				headers: {
					'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
					'Accept-Language': 'en-US,en;q=0.9',
					'X-Riot-Token': apiKey,
				},
			})
			.toPromise()
			.then(async (resp) => {
				const matchlist: Matchlist = resp.data

				this.logger.log(`${matchlist.totalGames} total matches, returning indices ${matchlist.startIndex} - ${matchlist.endIndex}`, ' getMatchlist | match-svc ')

				const allMatches: Match[] = matchlist.matches

				if (getLastX === undefined) {
					return allMatches
				}
				if (getLastX < MIN_NUM_MATCHES) {
					return []
				}
				if (getLastX > MAX_NUM_MATCHES) {
					getLastX = MAX_NUM_MATCHES
				}

				// TODO: incorporate this limit in request to Riot API
				const returnData: Match[] = allMatches.slice(0, getLastX)

				return includeGameData
					? await Promise.all(returnData.map(match => this.getGame(apiKey, match.gameId) as Promise<Game>))
					: returnData
			})
			.catch(err => {
				this.logger.error(`Error while fetching matches!\n\n${JSON.stringify(err, null, 4)}`, ' getMatchlist | match-svc ')

				return []
			})
	}

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
}
