import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { ENV_API_KEY, ENV_DEFAULT_API_PORT } from './constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  console.log(`[ bootstrap | main ] Enabling CORS...`)
  app.enableCors()

  const configService = app.get(ConfigService)
  const port = configService.get(ENV_API_KEY, ENV_DEFAULT_API_PORT)

  console.log(`[ bootstrap | main ] Starting to listen for NestJS app on port ${port}...`)

  await app.listen(port)
}

bootstrap()
