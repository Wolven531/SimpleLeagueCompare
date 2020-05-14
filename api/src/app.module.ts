import { HttpModule, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/config.module';
import { MatchlistModule } from './matchlist/matchlist.module';

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
		Logger,
	],
})
export class AppModule { }
