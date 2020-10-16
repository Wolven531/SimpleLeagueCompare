import { User } from '@models/user.model'
import {
	Controller,
	Get,
	Header,
	HttpCode,
	HttpStatus,
	Inject,
	Logger
} from '@nestjs/common'
import { execFileSync } from 'child_process'
import { join } from 'path'
import { JsonLoaderService } from '../services/json-loader.service'

@Controller('user')
export class UserController {
	constructor(
		private readonly jsonService: JsonLoaderService,
		@Inject(Logger)
		private readonly logger: Logger
	) { }

	@Get()
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	async getUsers(): Promise<User[]> {
		return this.jsonService.loadUsersFromFile()
	}

	@Get('search')
	@HttpCode(HttpStatus.OK)
	@Header('Cache-Control', 'none')
	// GOAL -
	// async searchUsers(): Promise<User> {
	async searchUsers(): Promise<any> {
		return {}
	}

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

		this.logger.warn('Script completed', ' refreshUserData | user-ctrl ')

		return 'OK'
	}
}
