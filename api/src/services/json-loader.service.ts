import {
	Inject,
	Injectable,
	Logger,
	LoggerService
} from '@nestjs/common'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { READ_AND_WRITE } from '../constants'
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
		try {
			const fileContents = readFileSync(join(__dirname, '..', 'data', 'users.json')).toString('utf8')

			// this.logger.log(`fileContents=\n\n${fileContents}\n`, ' loadUsersFromFile | json-loader-svc ')

			const users = JSON.parse(fileContents)

			this.logger.log(`users loaded\n\n${JSON.stringify(users, null, 4)}\n`, ' loadUsersFromFile | json-loader-svc ')

			return users
		} catch(e) {
			this.logger.error(`Failed to load users file; err=\n\n${e}\n`, ' loadUsersFromFile | json-loader-svc ')
		}
		return []
	}

	updateUsersFile(updatedUsers: User[]) {
		this.logger.log(`users about to be saved\n\n${JSON.stringify(updatedUsers, null, 4)}\n`, ' updateUsersFile | json-loader-svc ')

		try {
			writeFileSync(
				join(__dirname, '..', 'data', 'users.json'),
				JSON.stringify(updatedUsers, null, 4),
				{
					flag: READ_AND_WRITE,
				},
			)

			this.logger.log(`users file updated\n\n${JSON.stringify(updatedUsers, null, 4)}\n`, ' updateUsersFile | json-loader-svc ')
		} catch(e) {
			this.logger.error(`Failed to update users file; err=\n\n${e}\n`, ' updateUsersFile | json-loader-svc ')
		}
	}
}