import { HttpModule, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MatchlistController } from './matchlist.controller';

@Module({
	controllers: [MatchlistController],
	imports: [HttpModule],
	providers: [
		ConfigService,
		Logger,
	],
})
export class MatchlistModule { }
