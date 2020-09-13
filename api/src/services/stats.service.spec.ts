import { CalculatedStats } from '@models/calculated-stats.model'
import { Game } from '@models/game.model'
import { ParticipantIdentity } from '@models/participant-identity.model'
import { Participant } from '@models/participant.model'
import { Player } from '@models/player.model'
import { Stats } from '@models/stats.model'
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

		const generatePlayer = (id: number): Player =>
			new Player('p', `a${id}`, `sn${id}`, `s${id}`, 'p', `a${id}`, 'm', 0)
		const generateParticipantIdentity = (id: number): ParticipantIdentity =>
			new ParticipantIdentity(id, generatePlayer(id))

		const testCases_CalculateGeneralStats: TestCase_CalculateGeneralStats[] = [
			{
				expectedResult: new CalculatedStats(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
				param1: '',
				param2: [],
				name: 'empty account id and empty games array',
			},
			{
				expectedResult: new CalculatedStats(1, 0, 0, 0, 1200, 1200, 0, 0, 0, 0, 0, 0, 1, 0, 0),
				param1: 'a1',
				param2: [
					new Game(
						(new Date()).getTime(),
						60 * 20,
						1,
						'',
						'',
						'',
						0,
						[
							generateParticipantIdentity(1),
							generateParticipantIdentity(2)
						],
						[
							// new Participant(1, 100, 1, 0, 0, new Stats(1, true, 0, 0, 0, 0, 0, 0, 0, 10, 2, 20, 5, 3, 2, 400, 1, 1, 1, 1, 0, 10000, 7000, 3000, 0, 300, ))
						], 'p', 0, 2020, []),
				],
				name: 'a single Game that matches',
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
