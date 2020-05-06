import { Controller, Get, Response, HttpStatus } from '@nestjs/common'
import { AppService } from './app.service'
import { Response as ExResponse } from 'express'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('matchlist')
  async getMatchlist(@Response() response: ExResponse): Promise<void> {
    // TODO: parameterize accountId
    // see: https://docs.nestjs.com/controllers#route-parameters
    const accountId = 'U9b-KVWyJkTpQR0YiPJt7U8DFqy5llDfTJZYV56-G7onXevEOMC_DiI1'
    const apiKey = 'RGAPI-5de0a5bb-7903-4d74-b1ac-dbef09e7f2a9'

    const matchList = await this.appService.getMatchlist(apiKey, accountId)
    response.send(matchList)
    response.end()
  }
}
