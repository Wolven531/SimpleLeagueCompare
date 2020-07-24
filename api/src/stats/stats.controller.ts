import { Controller } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MatchlistService } from '../services/matchlist.service'

@Controller('stats')
export class StatsController {
	constructor(
		private readonly matchlistService: MatchlistService,
		private readonly configService: ConfigService,
	) { }
}
