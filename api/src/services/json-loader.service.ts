import {
	Inject,
	Injectable,
	Logger,
	LoggerService
} from '@nestjs/common'
import { readFileSync } from 'fs'
import { join } from 'path'
import { User } from '../models/user.model'

@Injectable()
export class JsonLoaderService {
	constructor(
		@Inject(Logger)
		private readonly logger: LoggerService
	) {}

	getUserByFriendlyName(friendlyName: string): User | undefined {
		const searchKey = friendlyName.toLowerCase()
		const users = this.loadUsersFromFile()

		this.logger.log(`Searching for friendlyName = "${searchKey}"`, ' getUserByFriendlyName | json-loader-svc ')

		return users.find(u => u.name.toLowerCase() === searchKey)
	}

	loadUsersFromFile(): User[] {
		const fileContents = readFileSync(join(__dirname, '..', 'data', 'users.json'))

		this.logger.log(`fileContents=\n\n${fileContents}\n`, ' loadUsersFromFile | json-loader-svc ')

		return []
	}
}