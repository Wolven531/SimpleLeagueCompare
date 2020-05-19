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

		if (getLastX !== undefined) {
			return allMatches.slice(0, getLastX)
		}

		return allMatches
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
