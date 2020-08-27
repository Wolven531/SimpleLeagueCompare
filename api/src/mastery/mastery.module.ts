import { HttpModule, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonLoaderService } from '../services/json-loader.service';
import { MasteryService } from '../services/mastery.service';
import { MasteryController } from './mastery.controller';

@Module({
	controllers: [MasteryController],
	imports: [HttpModule],
	providers: [
		ConfigService,
		JsonLoaderService,
		MasteryService,
		Logger,
	],
})
export class MasteryModule { }
