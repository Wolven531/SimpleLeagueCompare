import { HttpModule, Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

// services
import { AppService } from '../services/app.service'
import { JsonLoaderService } from '../services/json-loader.service'
import { MatchlistService } from '../services/matchlist.service'

// in "aunt / uncle" dirs
import { ConfigurationModule } from '../config/config.module'
import { MatchlistModule } from '../matchlist/matchlist.module'
import { UserModule } from '../user/user.module'

// local
import { AppController } from './app.controller'

@Module({
	controllers: [AppController],
	imports: [
		// NOTE: see https://docs.nestjs.com/techniques/configuration for more info
		ConfigModule.forRoot({
			envFilePath: [
				'.env.production',
				'.env.development',
				'.env',
			],
			isGlobal: true,
		}),
		HttpModule,
		ConfigurationModule,
		MatchlistModule,
		UserModule
	],
	providers: [
		AppService,
		JsonLoaderService,
		MatchlistService,
		Logger,
	],
})
export class AppModule { }
