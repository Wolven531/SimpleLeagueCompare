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
import { MatchlistService } from '../services/matchlist.service'
import {
	ENV_API_KEY,
	ENV_API_KEY_DEFAULT,
	MAX_NUM_MATCHES,
	MIN_NUM_MATCHES
} from '../constants'

@Controller('matchlist')
export class MatchlistController {
	constructor(
		private readonly matchlistService: MatchlistService,
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
		const allMatches = await this.matchlistService.getMatchlist(apiKey, accountId)

		if (getLastX === undefined) {
			return allMatches
		} else if (getLastX < MIN_NUM_MATCHES) {
			return []
		} else if (getLastX > MAX_NUM_MATCHES) {
			getLastX = MAX_NUM_MATCHES
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
		// return this.matchlistService.getMatchlist(apiKey, accountId)
		// TODO: integrate w/ Riot API for individual game
		return {
			apiKey,
			gameId
		};
	}
}
