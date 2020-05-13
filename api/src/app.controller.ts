import {
	Controller,
	Get,
	Header,
	HttpCode,
	HttpStatus,
	Param
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppService } from './app.service'
import { ENV_API_KEY, ENV_API_KEY_DEFAULT } from './constants'

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly configService: ConfigService,
	) { }

	@Get()
	@HttpCode(HttpStatus.OK)
	getHello(): string {
		return this.appService.getHello()
	}

	@Get('matchlist/:accountId')
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	async getMatchlist(
		@Param('accountId') accountId: string,
		// NOTE: if included, response stream MUST be closed via .end()
		// @Response() response: ExResponse
	): Promise<any[]> {
		const apiKey = this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)
		return this.appService.getMatchlist(apiKey, accountId)
	}
}
