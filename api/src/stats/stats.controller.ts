import {
	BadRequestException,
	Controller,
	Get,
	Header,
	HttpCode,
	HttpStatus,
	Inject,
	Logger,
	LoggerService,
	Query
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MatchlistService } from '../services/matchlist.service'
import { ENV_API_KEY, ENV_API_KEY_DEFAULT } from '../constants'

@Controller('stats')
export class StatsController {
	constructor(
		private readonly matchlistService: MatchlistService,
		private readonly configService: ConfigService,
		@Inject(Logger)
		private readonly logger: LoggerService,
	) { }

	@Get('summary')
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	async getSummary(
		@Query('accountId') accountId: string | undefined,
		@Query('getLastX') getLastX: number | undefined,
		@Query('includeGameData') includeGameData: boolean = false,
	): Promise<any> {
		if (!accountId || accountId.length < 1) {
			throw new BadRequestException({
				error: true,
				headersRequired: [],
				queryParamsRequired: [
					{
						name: 'accountId',
						type: 'string',
					},
				],
			})
		}

		const apiKey = this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)

		const matches = await this.matchlistService.getMatchlist(apiKey, accountId, getLastX, includeGameData)

		return {
			accountId,
			getLastX,
			includeGameData,
			matches,
		}
	}
}
