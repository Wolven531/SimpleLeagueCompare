import {
	Controller,
	Get,
	Header,
	HttpCode,
	HttpStatus,
	// Param,
	// Query
} from '@nestjs/common'
// import { ConfigService } from '@nestjs/config'
// import { MatchlistService } from '../services/matchlist.service'
// import {
// 	ENV_API_KEY,
// 	ENV_API_KEY_DEFAULT
// } from '../constants'

@Controller('user')
export class UserController {
	constructor(
		// private readonly matchlistService: MatchlistService,
		// private readonly configService: ConfigService,
	) { }

	@Get('refresh')
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	async refreshUserData(): Promise<string> {
		// const apiKey = this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)

		// return this.matchlistService.getMasteryTotal(apiKey, summonerId)
		return 'OK'
	}
}
