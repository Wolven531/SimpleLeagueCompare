import { HttpModule, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonLoaderService } from '../services/json-loader.service';
import { MatchlistService } from '../services/matchlist.service';
import { StatsController } from './stats.controller';

@Module({
	controllers: [StatsController],
	imports: [HttpModule],
	providers: [
		ConfigService,
		JsonLoaderService,
		MatchlistService,
		Logger,
	],
})
export class StatsModule { }
