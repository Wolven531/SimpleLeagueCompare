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
		@Query('summonerId') summonerId: string | undefined,
	): Promise<any> {
		if (!summonerId || summonerId.length < 1) {
			throw new BadRequestException({
				error: true,
				headersRequired: [],
				queryParamsRequired: [
					{
						name: 'summonerId',
						type: 'string',
					},
				],
			})
		}

		const apiKey = this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)

		return {
			apiKey,
			summonerId,
		}
	}
}
