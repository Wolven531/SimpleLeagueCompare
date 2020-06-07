import { HttpService, Injectable } from '@nestjs/common'
import { Game } from '../models/game.model'
import { DEFAULT_TOTAL_MASTERY_SCORE } from '../constants'

const REGION = 'na1'

@Injectable()
export class MatchlistService {
  constructor(private httpService: HttpService) {}

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

        console.log(`[ getGame | match-svc ] Fetched game! Created = ${gameInfo.gameCreation} Duration = ${gameInfo.gameDuration}`)

        return gameInfo
      },
      rejectionReason => {
        console.log(`[ getGame | match-svc ] Promise rejected!\n\n${JSON.stringify(rejectionReason, null, 4)}`)

        return null
      })
      .catch(err => {
        console.log(`[ getGame | match-svc ] Error while fetching game!\n\n${JSON.stringify(err, null, 4)}`)
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
      .toPromise()
      .then(resp => {
          const { endIndex, matches, startIndex, totalGames } = resp.data

          console.log(`[ getMatchlist | match-svc ] ${totalGames} total matches, returning indices ${startIndex} - ${endIndex}`)

          return matches
        },
        rejectionReason => {
          console.log(`[ getMatchlist | match-svc ] Promise rejected!\n\n${JSON.stringify(rejectionReason, null, 4)}`)

          return []
        }
      )
      .catch(err => {
        console.log(`[ getMatchlist | match-svc ] Error while fetching matches!\n\n${JSON.stringify(err, null, 4)}`)
      })
  }

  getTotalMastery(apiKey: string, summonerId: string, defaultMasteryTotal = DEFAULT_TOTAL_MASTERY_SCORE): Promise<number> {
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

        console.log(`[ getTotalMastery | match-svc ] totalScore=${totalScore}`)

        return totalScore
      },
        rejectionReason => {
          console.log(`[ getTotalMastery | match-svc ] Promise rejected!\n\n${JSON.stringify(rejectionReason, null, 4)}`)
          return defaultMasteryTotal
        })
      .catch(err => {
        console.log(`[ getTotalMastery | match-svc ] Error while fetching total mastery score!\n\n${JSON.stringify(err, null, 4)}`)
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
