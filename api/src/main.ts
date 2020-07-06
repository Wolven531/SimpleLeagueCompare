import 'reflect-metadata'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { JsonLoaderService } from './services/json-loader.service'
import { MatchlistService } from './services/matchlist.service'
import {
	ENV_API_KEY,
	ENV_API_KEY_DEFAULT,
	ENV_API_PORT,
	ENV_API_PORT_DEFAULT
} from './constants'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true })
	const configService = app.get(ConfigService)
	const logger = app.get(Logger);
	const jsonLoaderService = app.get(JsonLoaderService)
	const matchlistService = app.get(MatchlistService)

	// NOTE: get values from ConfigService, which uses env files and vars
	const envApiKey = configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)
	const port = configService.get(ENV_API_PORT, ENV_API_PORT_DEFAULT)

	logger.debug(`Loaded apiKey from env=\t${envApiKey}`, 'bootstrap | main')

	if (!jsonLoaderService.isUsersFileFresh()) {
		logger.log(`About to refresh users...`, 'bootstrap | main')
	
		const updatedUsers = await matchlistService.refreshMasteryTotalForAllUsers(envApiKey)
	
		logger.log(`Updated ${updatedUsers.length} users`, 'bootstrap | main')
	} else {
		logger.log(`Skipping user refresh since users were all fresh`, 'bootstrap | main')
	}

	logger.log(`Starting to listen for NestJS app on port ${port}...`, 'bootstrap | main')

	await app.listen(port)
}

bootstrap()
