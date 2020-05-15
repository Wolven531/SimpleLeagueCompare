import { HttpModule, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from '../services/app.service';
import { MatchlistController } from './matchlist.controller';

@Module({
	controllers: [MatchlistController],
	imports: [HttpModule],
	providers: [
		AppService,
		ConfigService,
		Logger,
	],
})
export class MatchlistModule { }
