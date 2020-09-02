import {
	Controller,
	Get,
	Header,
	HttpCode,
	HttpStatus,
	Inject,
	Logger,
	LoggerService
} from '@nestjs/common'
import { execFileSync } from 'child_process'
import { join } from 'path'

@Controller('user')
export class UserController {
	constructor(
		@Inject(Logger)
		private readonly logger: LoggerService
	) { }

	@Get('refresh')
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	async refreshUserData(): Promise<string> {
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

		return 'OK'
	}
}
