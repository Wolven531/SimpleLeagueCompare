import { CalculatedStats } from '@models/calculated-stats.model'
import { Game } from '@models/game.model'
import { HttpModule, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { StatsService } from './stats.service'

type TestCase_CalculateGeneralStats = {
	expectedResult: CalculatedStats
	param1: string
	param2: Game[]
	name: string
}

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

		const testCases_CalculateGeneralStats: TestCase_CalculateGeneralStats[] = [
			{
				expectedResult: new CalculatedStats(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
				param1: '',
				param2: [],
				name: 'empty account id and empty games array',
			},
		]
		testCases_CalculateGeneralStats.forEach(({ expectedResult, param1, param2, name }) => {
			describe(`invoke calculateGeneralStats("${param1}", ${param2.length} games) [${name}]`, () => {
				let actualResult: CalculatedStats
	
				beforeEach(() => {
					actualResult = service.calculateGeneralStats(param1, param2)
				})
	
				it('returns expected CalculatedStats', () => {
					expect(actualResult).toEqual(expectedResult)
					expect(mockLog).toHaveBeenCalledTimes(1)
					expect(mockError).not.toHaveBeenCalled()
				})
			})
		})
	})
})
