import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import compression from 'compression'
import 'reflect-metadata'
import { AppModule } from './app/app.module'
import {
	ENV_API_KEY,
	ENV_API_KEY_DEFAULT,
	ENV_API_PORT,
	ENV_API_PORT_DEFAULT
} from './constants'
import { AppService } from './services/app.service'
import { JsonLoaderService } from './services/json-loader.service'
import { MasteryService } from './services/mastery.service'

async function bootstrap() {
	const ctx = '[ bootstrap | main ]'
	const swaggerEndpoint = 'api'

	const app = await NestFactory.create(
		AppModule,
		{
			cors: true,
			logger: ['debug', 'error', 'log', 'verbose', 'warn',],
		},
	)

	const appService = app.get(AppService)
	const configService = app.get(ConfigService)
	const jsonLoaderService = app.get(JsonLoaderService)
	const logger = app.get(Logger)
	const masteryService = app.get(MasteryService)

	logger.log('Creating OpenAPI Document...', ctx)

	const swaggerOptions = new DocumentBuilder()
		.setTitle('Simple League Compare API')
		.setDescription('This API feeds a web UI for the Simple League Compare application')
		.setExternalDoc('Riot Official API Documentation', 'https://developer.riotgames.com/apis')
		.setVersion('1.0')
		.addTag('compare')
		.build()
	const document = SwaggerModule.createDocument(app, swaggerOptions)

	logger.log(`Enabling Swagger documentation at "/${swaggerEndpoint}"...`, ctx)

	SwaggerModule.setup(swaggerEndpoint, app, document)

	// NOTE: get values from ConfigService, which uses env files and vars
	const envApiKey = configService.get<string>(ENV_API_KEY, ENV_API_KEY_DEFAULT)
	const port = configService.get<number>(ENV_API_PORT, ENV_API_PORT_DEFAULT)

	logger.debug(`Loaded apiKey from env=${envApiKey}`, ctx)

	const isFresh = jsonLoaderService.isUsersFileFresh()
	const isValid = await appService.isRiotTokenValid()

	if (isFresh) {
		logger.log('Skipping user refresh since users were all fresh', ctx)
	} else if (isValid) {
		logger.log('Users file is NOT fresh, attempting to refresh w/ valid token...', ctx)

		const updatedUsers = await masteryService.refreshMasteryTotalForAllUsers(envApiKey)

		logger.log(`Updated ${updatedUsers.length} users`, ctx)
	} else {
		logger.log('Skipping user refresh since Riot API token is invalid...', ctx)
	}

	logger.log('Enabling API response compression...', ctx)

	app.use(compression({
		level: 9,
		memLevel: 9,
		threshold: 256,
	}))

	logger.log(`Listening for NestJS app on port ${port}...`, ctx)

	await app.listen(port)
}

bootstrap()
