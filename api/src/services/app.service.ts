import { HttpService, Injectable } from '@nestjs/common'

const REGION = 'na1'

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!'
  }

  async getMatchlist(apiKey: string, accountId: string): Promise<any[]> {
    return this.httpService
      // TODO: switch to header-based auth
      .get(`https://${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?api_key=${apiKey}`)
      .toPromise()
      .then(resp => {
          const { endIndex, matches, startIndex, totalGames } = resp.data

          console.log(`[ getMatchlist | app-svc ] ${totalGames} total matches, returning indices ${startIndex} - ${endIndex}`)

          return matches
        },
        rejectionReason => {
          console.log(`[ getMatchlist | app-svc ] Promise rejected!\n\n${JSON.stringify(rejectionReason, null, 4)}`)
        }
      )
      .catch(err => {
        console.log(`[ getMatchlist | app-svc ] Error while fetching matches!\n\n${JSON.stringify(err, null, 4)}`)
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
