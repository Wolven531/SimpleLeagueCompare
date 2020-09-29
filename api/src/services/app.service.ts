import {
	HttpService,
	HttpStatus,
	Inject,
	Injectable,
	Logger
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_API_KEY, ENV_API_KEY_DEFAULT, REGION } from '../constants'

@Injectable()
export class AppService {
	private static readonly BASE = `https://${REGION}.api.riotgames.com`
	private static readonly ENDPOINT_STATUS = 'lol/status/v3/shard-data'

	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(HttpService)
		private readonly httpService: HttpService,
		@Inject(Logger)
		private readonly logger: Logger,
	) {}

	getHello(): string {
		return 'Hello World!'
	}

	/**
	 * This method uses the ConfigService to check if the currently loaded Riot API token is valid
	 *
	 * @returns Promise<boolean> - true if the Riot API token can be used
	 *   to successfully retrieve data from the Riot API; false otherwise
	 */
	async isRiotTokenValid(): Promise<boolean> {
		const ctx = '[ isRiotTokenValid | App-Svc ]'

		this.logger.verbose('Grabbing riotToken...', ctx)

		const riotToken = this.configService.get<string>(ENV_API_KEY, ENV_API_KEY_DEFAULT)

		this.logger.verbose(`riotToken="${riotToken}"`, ctx)
		this.logger.debug('About to contact Riot API...', ctx)

		const getResp = await this.httpService.get(`${AppService.BASE}/${AppService.ENDPOINT_STATUS}`, {
			headers: {
				'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
				'X-Riot-Token': riotToken,
				// "Accept-Language": "en-US,en;q=0.9",
				// "Origin": "https://developer.riotgames.com",
				// "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
			},
		}).toPromise()

		this.logger.debug(`Returning comparison of response status (${getResp.status}) to HttpStatus.OK...`, ctx)

		return getResp.status === HttpStatus.OK
	}
}
