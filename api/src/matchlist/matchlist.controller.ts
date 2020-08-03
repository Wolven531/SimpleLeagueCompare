import {
	Controller,
	Get,
	Header,
	HttpCode,
	HttpStatus,
	Inject,
	Logger,
	LoggerService,
	Param,
	Query
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Game } from '@models/game.model'
import { Match } from '@models/match.model'
import { MatchlistService } from '../services/matchlist.service'
import {
	ENV_API_KEY,
	ENV_API_KEY_DEFAULT
} from '../constants'

@Controller('matchlist')
export class MatchlistController {
	constructor(
		private readonly matchlistService: MatchlistService,
		private readonly configService: ConfigService,
		@Inject(Logger)
		private readonly logger: LoggerService,
	) { }

	@Get(':accountId')
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	async getMatchlist(
		@Param('accountId') accountId: string,
		@Query('getLastX') getLastX: number | undefined,
		@Query('includeGameData') includeGameData: boolean = false,
	): Promise<Match[] | Game[]> {
		this.logger.log(
			`accountId=${accountId} getLastX=${getLastX} includeGameData=${includeGameData}`,
			' getMatchlist | MatchlistCtrl ',
		)
		const apiKey = this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)

		return this.matchlistService.getMatchlist(apiKey, accountId, getLastX, includeGameData)
	}

	@Get('game/:gameId')
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	async getGame(
		@Param('gameId') gameId: number,
	): Promise<Game> {
		this.logger.log(`gameId=${gameId}`, ' getGame | MatchlistCtrl ')
		const apiKey = this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)

		return this.matchlistService.getGame(apiKey, gameId) as Promise<Game>
	}

	@Get('mastery/:summonerId')
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	async getMasteryTotal(
		@Param('summonerId') summonerId: string,
	): Promise<number> {
		this.logger.log(`summonerId=${summonerId}`, ' getMasteryTotal | MatchlistCtrl ')
		const apiKey = this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)

		return this.matchlistService.getMasteryTotal(apiKey, summonerId)
	}
}
