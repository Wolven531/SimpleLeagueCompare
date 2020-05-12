import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import {
	ENV_API_KEY,
	ENV_API_KEY_DEFAULT,
	ENV_API_PORT,
	ENV_API_PORT_DEFAULT
} from './constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const configService = app.get(ConfigService)
  const envApiKey = configService.get(ENV_API_KEY, ENV_API_KEY_DEFAULT)
  const port = configService.get(ENV_API_PORT, ENV_API_PORT_DEFAULT)

  console.log(`[ bootstrap | main ] Loaded apiKey from env=\t${envApiKey}`)
  console.log(`[ bootstrap | main ] Starting to listen for NestJS app on port ${port}...`)

  await app.listen(port)
}

bootstrap()
