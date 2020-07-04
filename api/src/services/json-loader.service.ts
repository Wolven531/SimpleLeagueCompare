import {
	Inject,
	Injectable,
	Logger,
	LoggerService
} from '@nestjs/common'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { ENCODING_UTF8, READ_AND_WRITE, TIME_MILLIS_IN_DAY } from '../constants'
import { User } from '../models/user.model'

@Injectable()
export class JsonLoaderService {
	private readonly DIRECTORY_DATA = 'data'
	private readonly FILENAME_USERS = 'users.json'

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

	isUsersFileFresh(): boolean {
		const loadedUsers = this.loadUsersFromFile()
		const now = new Date()
		const utcNow = Date.UTC(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			now.getHours(),
			now.getMinutes(),
			now.getSeconds(),
			now.getMilliseconds())

		return loadedUsers.every(user => {
			utcNow - user.lastUpdated <= TIME_MILLIS_IN_DAY
		})
	}

	loadUsersFromFile(): User[] {
		try {
			const fileContents = readFileSync(join(__dirname, '..', this.DIRECTORY_DATA, this.FILENAME_USERS)).toString(ENCODING_UTF8)

			// this.logger.log(`fileContents=\n\n${fileContents}\n`, ' loadUsersFromFile | json-loader-svc ')

			const users: User[] = JSON.parse(fileContents)

			this.logger.log(`users loaded\n\n${JSON.stringify(users, null, 4)}\n`, ' loadUsersFromFile | json-loader-svc ')

			return users
		} catch(e) {
			this.logger.error(`Failed to load users file; err=\n\n${e}\n`, ' loadUsersFromFile | json-loader-svc ')
		}
		return []
	}

	updateUsersFile(updatedUsers: User[]) {
		const filepathUsers = join(__dirname, '..', this.DIRECTORY_DATA, this.FILENAME_USERS)

		this.logger.log(`${updatedUsers.length} users about to be saved to file at "${filepathUsers}"`, ' updateUsersFile | json-loader-svc ')

		try {
			writeFileSync(
				filepathUsers,
				`${JSON.stringify(updatedUsers, null, 4)}\n`,
				{
					encoding: ENCODING_UTF8,
					flag: READ_AND_WRITE,
				},
			)

			this.logger.log(`users file updated\n\n${JSON.stringify(updatedUsers, null, 4)}\n`, ' updateUsersFile | json-loader-svc ')
		} catch(e) {
			this.logger.error(`Failed to update users file; err=\n\n${e}\n`, ' updateUsersFile | json-loader-svc ')
		}
	}
}