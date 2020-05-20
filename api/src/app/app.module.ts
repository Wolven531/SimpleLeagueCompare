import { HttpModule, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// in "aunt / uncle" dirs
import { ConfigurationModule } from '../config/config.module';
import { MatchlistModule } from '../matchlist/matchlist.module';
import { AppService } from '../services/app.service';
import { MatchlistService } from '../services/matchlist.service';

// local
import { AppController } from './app.controller';

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
	],
	providers: [
		AppService,
		MatchlistService,
		Logger,
	],
})
export class AppModule { }
