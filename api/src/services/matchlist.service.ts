import {
	HttpService,
	Inject,
	Injectable,
	Logger,
	LoggerService
} from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { utc } from 'moment'
import { Game } from '../models/game.model'
import { Match } from '../models/match.model'
import { Matchlist } from '../models/matchlist.model'
import { User } from '../models/user.model'
import {
	DEFAULT_TOTAL_MASTERY_SCORE,
	MAX_NUM_MATCHES,
	MIN_NUM_MATCHES
} from '../constants'
import { JsonLoaderService } from './json-loader.service'

const REGION = 'na1'

@Injectable()
export class MatchlistService {
	constructor(
		private httpService: HttpService,
		@Inject(Logger)
		private readonly logger: LoggerService,
		private readonly jsonLoaderService: JsonLoaderService,
	) { }

	getGame(apiKey: string, gameId: number): Promise<Game | void> {
		return this.httpService.get(`https://${REGION}.api.riotgames.com/lol/match/v4/matches/${gameId}`,
			{
				headers: {
					"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
					"Accept-Language": "en-US,en;q=0.9",
					"X-Riot-Token": apiKey,
				},
			})
			.toPromise<AxiosResponse<Game>>()
			.then(
				resp => {
					const gameInfo: Game = resp.data

					this.logger.log(`Fetched game (id = ${gameId})! Created = ${gameInfo.gameCreation} Duration = ${gameInfo.gameDuration}`, ' getGame | match-svc ')

					return gameInfo
				},
				rejectionReason => {
					this.logger.log(`Promise rejected!\n\n${JSON.stringify(rejectionReason, null, 4)}`, ' getGame | match-svc ')
				})
			.catch(err => {
				this.logger.log(`Error while fetching game!\n\n${JSON.stringify(err, null, 4)}`, ' getGame | match-svc ')
			})
	}

	getMatchlist(apiKey: string, accountId: string, getLastX: number | undefined, includeGameData: boolean = false): Promise<Match[] | Game[]> {
		return this.httpService.get(`https://${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}`,
			{
				headers: {
					"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
					"Accept-Language": "en-US,en;q=0.9",
					"X-Riot-Token": apiKey,
				},
			})
			.toPromise<AxiosResponse<Matchlist>>()
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
				},
				rejectionReason => {
					this.logger.log(`Promise rejected!\n\n${JSON.stringify(rejectionReason, null, 4)}`, ' getMatchlist | match-svc ')

					return []
				}
			)
			.catch(err => {
				this.logger.log(`Error while fetching matches!\n\n${JSON.stringify(err, null, 4)}`, ' getMatchlist | match-svc ')

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
			.toPromise<AxiosResponse<string>>()
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
				.toPromise<AxiosResponse<string>>()
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

	/*
	const fetchMatchList = async (encryptedAccountKey: string): Promise<void> => {
	  // const headers: Headers = new Headers()
	  // headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36')
	  // headers.set('Accept-Language', 'en-US,en;q=0.9')
	  // headers.set('Accept-Charset', 'application/x-www-form-urlencoded; charset=UTF-8')
	  // headers.set('X-Riot-Token', 'devAPIKey)
  
	  // NOTE: using token in headers appears to be broken due to pre-flight OPTIONS request in Chrome
	  return fetch(`https://${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountKey}?api_key=${devAPIKey}`, {
		// cache: 'no-cache', // no-cache, reload, force-cache, only-if-cached
		// credentials: 'same-origin', // include, same-origin, omit
		// headers: {
		  // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36',
		  // 'Accept-Language': 'en-US,en;q=0.9',
		  // 'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
		  // NOTE: cannot use custom header (to keep request simple enough for CORS)
		  //   'X-Riot-Token': devAPIKey
		// },
		// method: 'get',
		// mode: 'cors', // 'no-cors'
		// redirect: 'follow', // manual, *follow, error
		// referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	  })
	}
	*/
}
