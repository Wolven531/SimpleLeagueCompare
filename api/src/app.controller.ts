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

  @Get('matchlist/:accountId/:apiKey')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'none')
  async getMatchlist(
    @Param('accountId') accountId: string,
    @Param('apiKey') apiKey: string,
    // NOTE: if included, response stream MUST be closed via .end()
    // @Response() response: ExResponse
  ): Promise<any[]> {
    return this.appService.getMatchlist(apiKey, accountId)
  }
}
