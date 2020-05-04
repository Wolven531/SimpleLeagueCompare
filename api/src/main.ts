import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = 3049
  console.log(`Starting to listen for NestJS app on port ${port}...`)

  // TODO: load this from process.env
  await app.listen(port)
}

bootstrap()
