import {
	HttpService,
	Inject,
	Injectable,
	Logger,
	LoggerService
} from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { Game } from '../models/game.model'
import { Matchlist } from '../models/matchlist.model'
import { DEFAULT_TOTAL_MASTERY_SCORE } from '../constants'
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

	getGame(apiKey: string, gameId: string): Promise<Game> {
		return this.httpService.get(`https://${REGION}.api.riotgames.com/lol/match/v4/matches/${gameId}`,
			{
				headers: {
					"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
					"Accept-Language": "en-US,en;q=0.9",
					"X-Riot-Token": apiKey,
				},
			})
			.toPromise()
			.then(resp => {
				const gameInfo = resp.data as Game

				this.logger.log(`Fetched game! Created = ${gameInfo.gameCreation} Duration = ${gameInfo.gameDuration}`, ' getGame | match-svc ')

				return gameInfo
			},
				rejectionReason => {
					this.logger.log(`Promise rejected!\n\n${JSON.stringify(rejectionReason, null, 4)}`, ' getGame | match-svc ')

					return null
				})
			.catch(err => {
				this.logger.log(`Error while fetching game!\n\n${JSON.stringify(err, null, 4)}`, ' getGame | match-svc ')
			})
	}

	getMatchlist(apiKey: string, accountId: string): Promise<any[]> {
		return this.httpService.get(`https://${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}`,
			{
				headers: {
					"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
					"Accept-Language": "en-US,en;q=0.9",
					"X-Riot-Token": apiKey,
				},
			})
			.toPromise<AxiosResponse<Matchlist>>()
			.then(resp => {
				const matchlist: Matchlist = resp.data

				this.logger.log(`${matchlist.totalGames} total matches, returning indices ${matchlist.startIndex} - ${matchlist.endIndex}`, ' getMatchlist | match-svc ')

				return matchlist.matches
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

	getTotalMastery(apiKey: string, summonerId: string, defaultMasteryTotal = DEFAULT_TOTAL_MASTERY_SCORE): Promise<number> {
		const loadedUsers = this.jsonLoaderService.loadUsersFromFile()
		const targetUser = loadedUsers.find(user => user.summonerId === summonerId)

		if (targetUser) {
			const lastUpdatedUtc = new Date(targetUser.lastUpdated)
			const now = new Date()
			const nowUtc = new Date(Date.UTC(now.getFullYear(), now.getMonth()))
			const diff = nowUtc.getTime() - lastUpdatedUtc.getTime()

			// NOTE: if diff in time is less than or equal to 24 hours (i.e. one day)
			if (diff <= (1000 * 60 * 60 * 24)) {
				return Promise.resolve(targetUser.totalMastery)
			}
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
				const totalScore = parseInt(resp.data, 10)

				this.logger.log(`totalScore=${totalScore}`, ' getTotalMastery | match-svc ')

				return totalScore
			},
				rejectionReason => {
					this.logger.log(`Promise rejected!\n\n${JSON.stringify(rejectionReason, null, 4)}`, ' getTotalMastery | match-svc ')
					return defaultMasteryTotal
				})
			.catch(err => {
				this.logger.log(`Error while fetching total mastery score!\n\n${JSON.stringify(err, null, 4)}`, ' getTotalMastery | match-svc ')
				return defaultMasteryTotal
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
