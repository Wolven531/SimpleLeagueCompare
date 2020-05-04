import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const port = configService.get('API_PORT', 3000)

  console.log(`Starting to listen for NestJS app on port ${port}...`)

  await app.listen(port)
}

bootstrap()
