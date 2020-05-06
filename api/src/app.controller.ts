import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('matchlist')
  async getMatchlist(): Promise<any[]> {
    // TODO: parameterize accountId
    // see: https://docs.nestjs.com/controllers#route-parameters
    const accountId = 'U9b-KVWyJkTpQR0YiPJt7U8DFqy5llDfTJZYV56-G7onXevEOMC_DiI1'

    return this.appService.getMatchlist(accountId, accountId)
  }
}
