import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Response
} from '@nestjs/common'
import { Response as ExResponse } from 'express'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('matchlist/:accountId')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'none')
  async getMatchlist(
    @Param('accountId') accountId: string,
    @Response() response: ExResponse
  ): Promise<void> {
    // const apiKey = 'RGAPI-5de0a5bb-7903-4d74-b1ac-dbef09e7f2a9' // May 5, 2020
    const apiKey = 'RGAPI-ed04f1e8-2244-4161-90d3-28a96d524ab6' // May 6, 2020
    const matchList = await this.appService.getMatchlist(apiKey, accountId)

    response.send(matchList)
    response.end()
  }
}
