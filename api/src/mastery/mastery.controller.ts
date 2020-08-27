import { Game } from '@models/game.model';
import { Controller, Inject, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExtraModels } from '@nestjs/swagger';
import { MatchlistService } from '../services/matchlist.service';

@Controller('mastery')
@ApiExtraModels(Game)
export class MasteryController {
	constructor(
		private readonly matchlistService: MatchlistService,
		private readonly configService: ConfigService,
		@Inject(Logger)
		private readonly logger: LoggerService,
	) { }
}
