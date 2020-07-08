import { HttpModule, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JsonLoaderService } from '../services/json-loader.service'
// import { MatchlistService } from '../services/matchlist.service'
import { UserController } from './user.controller'

@Module({
	controllers: [UserController],
	imports: [HttpModule],
	providers: [
		ConfigService,
		JsonLoaderService,
		// MatchlistService,
		Logger,
	],
})
export class UserModule { }
