import {
	Controller,
	Get,
	Header,
	HttpCode,
	HttpStatus,
	Param,
	Query
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppService } from '../services/app.service'
import { ENV_API_KEY, ENV_API_KEY_DEFAULT } from '../constants'

@Controller('matchlist')
export class MatchlistController {
	private readonly MAX_VALID_MATCHES = 100
	private readonly MIN_VALID_MATCHES = 1

	constructor(
		private readonly appService: AppService,
		private readonly configService: ConfigService,
	) { }

	@Get(':accountId')
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	async getMatchlist(
		@Param('accountId') accountId: string,
		@Query('getLastX') getLastX: number | undefined,
	): Promise<any[]> {
		const apiKey = this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)
		const allMatches = await this.appService.getMatchlist(apiKey, accountId)

		if (getLastX === undefined) {
			return allMatches
		} else if (getLastX < this.MIN_VALID_MATCHES) {
			return []
		} else if (getLastX > this.MAX_VALID_MATCHES) {
			getLastX = this.MAX_VALID_MATCHES
		}

		return allMatches.slice(0, getLastX)
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
