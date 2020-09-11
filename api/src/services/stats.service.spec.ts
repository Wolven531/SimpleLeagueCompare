import { CalculatedStats } from '@models/calculated-stats.model'
import { HttpModule, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { StatsService } from './stats.service'

describe('Stats Service', () => {
	let service: StatsService
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [],
			imports: [HttpModule],
			providers: [
				StatsService,
				Logger,
			],
		}).compile()

		service = testModule.get(StatsService)
	})

	afterEach(async () => {
		await testModule.close()
	})

	describe('w/ mocked logger functions [ error, log ]', () => {
		let mockError: jest.Mock
		let mockLog: jest.Mock

		beforeEach(() => {
			mockError = jest.fn((msg, ...args) => {})
			mockLog = jest.fn((msg, ...args) => {})

			jest.spyOn(testModule.get(Logger), 'error')
				.mockImplementation(mockError)
			jest.spyOn(testModule.get(Logger), 'log')
				.mockImplementation(mockLog)
		})

		afterEach(() => {
			jest.spyOn(testModule.get(Logger), 'error')
				.mockRestore()
			jest.spyOn(testModule.get(Logger), 'log')
				.mockRestore()
		})

		describe('invoke calculateGeneralStats("", [])', () => {
			let actualResult: CalculatedStats

			beforeEach(() => {
				actualResult = service.calculateGeneralStats('', [])
			})

			it('returns default values', () => {
				expect(actualResult).toEqual(new CalculatedStats(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0))
			})
		})
	})
})
