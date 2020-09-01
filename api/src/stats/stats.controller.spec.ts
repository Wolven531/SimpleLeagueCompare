import { CalculatedStats } from '@models/calculated-stats.model'
import { BadRequestException, HttpModule, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { JsonLoaderService } from '../services/json-loader.service'
import { MatchlistService } from '../services/matchlist.service'
import { StatsService } from '../services/stats.service'
import { StatsController } from './stats.controller'

describe('StatsController', () => {
	let controller: StatsController
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [StatsController],
			imports: [HttpModule],
			providers: [
				MatchlistService,
				ConfigService,
				StatsService,
				Logger,
				JsonLoaderService,
			],
		}).compile()

		controller = testModule.get(StatsController)
	})

	afterEach(async () => {
		await testModule.close()
	})

	describe('invoke getSummary(undefined, undefined)', () => {
		let capturedError: Error
		let resp: CalculatedStats

		beforeEach(async () => {
			try {
				resp = await controller.getSummary(undefined, undefined)
			} catch (err) {
				capturedError = err
			}
		})

		it('returns BadRequestException', () => {
			expect(resp).toBeUndefined()
			expect(capturedError).toBeInstanceOf(BadRequestException)
		})
	})
})
