import {
	Inject,
	Injectable,
	Logger,
	LoggerService
} from '@nestjs/common'
import USERS = require('../data/users.json')
import { User } from '../models/user.model'

const users: User[] = USERS

@Injectable()
export class JsonLoaderService {
	constructor(
		@Inject(Logger)
		private readonly logger: LoggerService
	) {}

	getUserByFriendlyName(friendlyName: string): User | undefined {
		const searchKey = friendlyName.toLowerCase()
		this.logger.log(`Searching for friendlyName = "${searchKey}"`, ' getUserByFriendlyName | json-loader-svc ')

		return users.find(u => u.name.toLowerCase() === searchKey)
	}
}