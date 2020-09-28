import {
	Controller,
	Get,
	HttpCode,
	HttpService,
	HttpStatus,
	Inject,
	Logger,
	LoggerService
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_API_KEY, ENV_API_KEY_DEFAULT, REGION } from '../constants'

@Controller('config')
export class ConfigController {
	constructor(
		private readonly configService: ConfigService,
		@Inject(HttpService)
		private readonly httpService: HttpService,
		@Inject(Logger)
		private readonly logger: LoggerService,
	) { }

	@Get()
	@HttpCode(HttpStatus.OK)
	getConfig(): Record<string, unknown> {
		this.logger.warn('Hit Endpoint! <3', 'getConfig | ConfigController')

		return {
			riotSecret: this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)
		}
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	async isTokenValid(): Promise<boolean> {
		const riotToken: string = this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)

		const getResp = await this.httpService.get(`https://${REGION}.api.riotgames.com/lol/status/v3/shard-data`, {
			headers: {
				'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
				'X-Riot-Token': riotToken,
				// "Accept-Language": "en-US,en;q=0.9",
				// "Origin": "https://developer.riotgames.com",
				// "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
			},
		}).toPromise()

		return getResp.status === HttpStatus.OK
	}
}
