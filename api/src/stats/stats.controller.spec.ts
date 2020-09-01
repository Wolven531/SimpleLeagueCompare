import { CalculatedStats } from '@models/calculated-stats.model'
import { Game } from '@models/game.model'
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

	describe('invoke getSummary("someAccountId", undefined)', () => {
		let capturedError: Error
		let mockCalculateGeneralStats: jest.Mock
		let mockGetMatchlist: jest.Mock
		let resp: CalculatedStats

		beforeEach(async () => {
			mockCalculateGeneralStats = jest.fn(
				(targetAccountKey, games) => ({ kDA: 3.14 } as CalculatedStats)
			)
			mockGetMatchlist = jest.fn(
				(apiKey, accountId, getLastX, includeGameData) => Promise.resolve([] as Array<Game>)
			)

			jest.spyOn(testModule.get(MatchlistService), 'getMatchlist')
				.mockImplementationOnce(mockGetMatchlist)
			jest.spyOn(testModule.get(StatsService), 'calculateGeneralStats')
				.mockImplementationOnce(mockCalculateGeneralStats)

			try {
				resp = await controller.getSummary('someAccountId', undefined)
			} catch (err) {
				capturedError = err
			}
		})

		it('invokes MatchlistSvc.getMatchlist() and StatsSvc.calculateGeneralStats(), does NOT throw error', () => {
			expect(capturedError).toBeUndefined()
			expect(mockCalculateGeneralStats).toHaveBeenCalledTimes(1)
			expect(mockGetMatchlist).toHaveBeenCalledTimes(1)
		})
	})
})
