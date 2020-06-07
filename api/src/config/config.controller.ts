import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Logger,
	LoggerService
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENV_API_KEY, ENV_API_KEY_DEFAULT } from '../constants'

@Controller('config')
export class ConfigController {
	constructor(
		private readonly configService: ConfigService,
		@Inject(Logger)
		private readonly logger: LoggerService,
	) { }

	@Get()
	@HttpCode(HttpStatus.OK)
	getConfig(): any {
		this.logger.warn(`Hit Endpoint! <3`, `getConfig | ConfigController`)
		return {
			riotSecret: this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)
		}
	}
}
