import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  imports: [
    // NOTE: see https://docs.nestjs.com/techniques/configuration for more info
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
