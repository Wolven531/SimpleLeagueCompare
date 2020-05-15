import {
	Controller,
	Get,
	Header,
	HttpCode,
	HttpStatus,
	Param
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppService } from '../services/app.service'
import { ENV_API_KEY, ENV_API_KEY_DEFAULT } from '../constants'

@Controller('matchlist')
export class MatchlistController {
	constructor(
		private readonly appService: AppService,
		private readonly configService: ConfigService,
	) { }

	@Get(':accountId')
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

	@Get('game/:gameId')
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	async getGame(
		@Param('gameId') gameId: string,
	): Promise<any> {
		const apiKey = this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)
		// return this.appService.getMatchlist(apiKey, accountId)
		// TODO: integrate w/ Riot API for individual game
		return {
			apiKey,
			gameId
		};
	}
}
