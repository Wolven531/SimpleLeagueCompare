import {
	Controller,
	Get,
	Header,
	HttpCode,
	HttpStatus,
	Inject,
	Logger,
	LoggerService,
	// Param,
	// Query
} from '@nestjs/common'
import { execFileSync } from 'child_process'
import { join } from 'path'
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
		@Inject(Logger)
		private readonly logger: LoggerService
	) { }

	@Get('refresh')
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	async refreshUserData(): Promise<string> {
		// const apiKey = this.configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)

		const dirContainingPackage = join(__dirname, '..', '..')
		this.logger.warn(
			`About to execute script in dir "${dirContainingPackage}" ...`,
			' refreshUserData | user-ctrl ')

		execFileSync(
			'npm',
			[
				'run',
				'copy:users:windows'
			],
			{
				cwd: dirContainingPackage,
				shell: true
			})

		this.logger.warn(`Script completed`, ' refreshUserData | user-ctrl ')

		// return this.matchlistService.getMasteryTotal(apiKey, summonerId)
		return 'OK'
	}
}
