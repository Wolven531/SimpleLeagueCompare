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
import { Game } from '../models/game.model'
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
		}
		if (getLastX < MIN_NUM_MATCHES) {
			return []
		}
		if (getLastX > MAX_NUM_MATCHES) {
			getLastX = MAX_NUM_MATCHES
		}

		return allMatches.slice(0, getLastX)
	}

	@Get('game/:gameId')
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	async getGame(
		@Param('gameId') gameId: string,
	): Promise<Game> {
		const apiKey = this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)

		return this.matchlistService.getGame(apiKey, gameId)
	}

	@Get('mastery/:summonerId')
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	async getMasteryTotal(
		@Param('summonerId') summonerId: string,
	): Promise<number> {
		const apiKey = this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)

		return this.matchlistService.getMasteryTotal(apiKey, summonerId)
	}
}
