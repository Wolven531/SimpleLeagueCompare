import { Game } from '@models/game.model'
import { Match } from '@models/match.model'
import { Matchlist } from '@models/matchlist.model'
import { HttpModule, HttpService, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { from } from 'rxjs'
import { MatchlistService } from './matchlist.service'

type TestCase_GetGame = {
	descriptionMockedBehavior: string
	descriptionParams: string
	expectedCountError: number
	expectedCountGet: number
	expectedCountLog: number
	expectedResult: Game | null
	mockHttpGet: jest.Mock
	param1: string
	param2: number
}
type TestCase_GetMatchlist = {
	descriptionMockedBehavior: string
	descriptionParams: string
	expectedCountError: number
	expectedCountGet: number
	expectedCountGetGame: number
	expectedCountLog: number
	expectedResult: Match[] | Game[]
	mockGetGame: jest.Mock
	mockHttpGet: jest.Mock
	param1: string
	param2: string
	param3: number | undefined
	param4: boolean | undefined
}

describe('Matchlist Service', () => {
	let service: MatchlistService
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [],
			imports: [HttpModule],
			providers: [
				MatchlistService,
				Logger,
			],
		}).compile()

		service = testModule.get(MatchlistService)
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

		const testCases_getGame: TestCase_GetGame[] = [
			{
				descriptionMockedBehavior: 'Http error occurs',
				descriptionParams: 'empty API key, gameId=0',
				expectedCountError: 1,
				expectedCountGet: 1,
				expectedCountLog: 0,
				expectedResult: null,
				mockHttpGet: jest.fn(() => from(Promise.reject(new Error('Fake ajw error')))),
				param1: '',
				param2: 0,
			},
			{
				descriptionMockedBehavior: 'Returned data is bad',
				descriptionParams: 'empty API key, gameId=0',
				expectedCountError: 1,
				expectedCountGet: 1,
				expectedCountLog: 0,
				expectedResult: null,
				mockHttpGet: jest.fn(() => from(Promise.resolve({}))),
				param1: '',
				param2: 0,
			},
			{
				descriptionMockedBehavior: 'Returned data is good',
				descriptionParams: 'empty API key, gameId=0',
				expectedCountError: 0,
				expectedCountGet: 1,
				expectedCountLog: 1,
				expectedResult: { gameCreation: 333, gameDuration: 444 } as Game,
				mockHttpGet: jest.fn(() =>
					from(Promise.resolve({ data: { gameCreation: 333, gameDuration: 444 } as Game }))),
				param1: '',
				param2: 0,
			},
		]
		testCases_getGame.forEach((
			{
				descriptionMockedBehavior,
				descriptionParams,
				expectedCountError,
				expectedCountGet,
				expectedCountLog,
				expectedResult,
				mockHttpGet,
				param1,
				param2,
			}) => {
			describe(`w/ mocked HttpGet (${descriptionMockedBehavior})`, () => {
				beforeEach(() => {
					jest.spyOn(testModule.get(HttpService), 'get')
						.mockImplementation(mockHttpGet)
				})

				afterEach(() => {
					jest.spyOn(testModule.get(HttpService), 'get')
						.mockRestore()
				})

				describe(`invoke getGame("${param1}", "${param2}") [${descriptionParams}]`, () => {
					let actualResult: Game | null

					beforeEach(async () => {
						actualResult = await service.getGame(param1, param2)
					})

					it('invokes get(), log(), error() correctly and returns expected result', () => {
						expect(mockError).toHaveBeenCalledTimes(expectedCountError)
						expect(mockLog).toHaveBeenCalledTimes(expectedCountLog)

						expect(mockHttpGet).toHaveBeenCalledTimes(expectedCountGet)
						if (expectedCountGet > 0) {
							expect(mockHttpGet).toHaveBeenLastCalledWith(
								'https://na1.api.riotgames.com/lol/match/v4/matches/0',
								{
									headers: {
										'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
										'Accept-Language': 'en-US,en;q=0.9',
										'X-Riot-Token': param1,
									},
								})
						}

						expect(actualResult).toEqual(expectedResult)
					})
				})
			})
		})

		const testCases_getMatchlist: TestCase_GetMatchlist[] = [
			{
				descriptionMockedBehavior: 'Http error occurs',
				descriptionParams: 'empty API key, empty AccountID, undefined getLast, undefined includeGameData',
				expectedCountError: 1,
				expectedCountGet: 1,
				expectedCountGetGame: 0,
				expectedCountLog: 0,
				expectedResult: [],
				mockGetGame: jest.fn(() => Promise.resolve()),
				mockHttpGet: jest.fn(() => from(Promise.reject(new Error('Fake ajw error')))),
				param1: '',
				param2: '',
				param3: undefined,
				param4: undefined,
			},
			{
				descriptionMockedBehavior: 'Returned data is bad',
				descriptionParams: 'empty API key, empty AccountID, undefined getLast, undefined includeGameData',
				expectedCountError: 1,
				expectedCountGet: 1,
				expectedCountGetGame: 0,
				expectedCountLog: 0,
				expectedResult: [],
				mockGetGame: jest.fn(() => Promise.resolve()),
				mockHttpGet: jest.fn(() => from(Promise.resolve({}))),
				param1: '',
				param2: '',
				param3: undefined,
				param4: undefined,
			},
			{
				descriptionMockedBehavior: 'Returned data is good',
				descriptionParams: 'empty API key, empty AccountID, undefined getLast, undefined includeGameData',
				expectedCountError: 0,
				expectedCountGet: 1,
				expectedCountGetGame: 0,
				expectedCountLog: 1,
				expectedResult: [
					new Match(222, 'NONE', 2020, 'NA1', 100, 1, 'NONE', new Date(2020, 1, 1).getTime()),
				],
				mockGetGame: jest.fn(() => Promise.resolve()),
				mockHttpGet: jest.fn(() => from(
					Promise.resolve({
						data: {
							endIndex: 1,
							startIndex: 0,
							matches: [
								new Match(222, 'NONE', 2020, 'NA1', 100, 1, 'NONE', new Date(2020, 1, 1).getTime()),
							] as Match[],
							totalGames: 1,
						} as Matchlist,
					})
				)),
				param1: '',
				param2: '',
				param3: undefined,
				param4: undefined,
			},
			{
				descriptionMockedBehavior: 'Returned data is good',
				descriptionParams: 'empty API key, empty AccountID, 0 getLast (less than min), undefined includeGameData',
				expectedCountError: 0,
				expectedCountGet: 1,
				expectedCountGetGame: 0,
				expectedCountLog: 1,
				expectedResult: [],
				mockGetGame: jest.fn(() => Promise.resolve()),
				mockHttpGet: jest.fn(() => from(
					Promise.resolve({
						data: {
							endIndex: 1,
							startIndex: 0,
							matches: [
								new Match(222, 'NONE', 2020, 'NA1', 100, 1, 'NONE', new Date(2020, 1, 1).getTime()),
							] as Match[],
							totalGames: 1,
						} as Matchlist,
					})
				)),
				param1: '',
				param2: '',
				param3: 0,
				param4: undefined,
			},
			{
				descriptionMockedBehavior: 'Returned data is good',
				descriptionParams: 'empty API key, empty AccountID, 101 getLast (greater than max), undefined includeGameData',
				expectedCountError: 0,
				expectedCountGet: 1,
				expectedCountGetGame: 0,
				expectedCountLog: 1,
				expectedResult: [
					new Match(222, 'NONE', 2020, 'NA1', 100, 1, 'NONE', new Date(2020, 1, 1).getTime()),
				],
				mockGetGame: jest.fn(() => Promise.resolve()),
				mockHttpGet: jest.fn(() => from(
					Promise.resolve({
						data: {
							endIndex: 1,
							startIndex: 0,
							matches: [
								new Match(222, 'NONE', 2020, 'NA1', 100, 1, 'NONE', new Date(2020, 1, 1).getTime()),
							] as Match[],
							totalGames: 1,
						} as Matchlist,
					})
				)),
				param1: '',
				param2: '',
				param3: 101,
				param4: undefined,
			},
			{
				descriptionMockedBehavior: 'Returned data is good',
				descriptionParams: 'empty API key, empty AccountID, 1 getLast, true includeGameData',
				expectedCountError: 0,
				expectedCountGet: 1,
				expectedCountGetGame: 1,
				expectedCountLog: 1,
				expectedResult: [
					new Game(222, 333, 444, 'CLASSIC', 'MATCHED_GAME', 'v1', 1, [], [], 'p1', 1, 2020, []),
				],
				mockGetGame: jest.fn(() => Promise.resolve(
					new Game(222, 333, 444, 'CLASSIC', 'MATCHED_GAME', 'v1', 1, [], [], 'p1', 1, 2020, []),
				)),
				mockHttpGet: jest.fn(() => from(
					Promise.resolve({
						data: {
							endIndex: 1,
							startIndex: 0,
							matches: [
								new Match(222, 'NONE', 2020, 'NA1', 100, 1, 'NONE', new Date(2020, 1, 1).getTime()),
							] as Match[],
							totalGames: 1,
						} as Matchlist,
					})
				)),
				param1: '',
				param2: '',
				param3: 1,
				param4: true,
			},
		]
		testCases_getMatchlist.forEach(({
			descriptionMockedBehavior,
			descriptionParams,
			expectedCountError,
			expectedCountGet,
			expectedCountGetGame,
			expectedCountLog, 
			expectedResult,
			mockGetGame,
			mockHttpGet,
			param1,
			param2,
			param3,
			param4,
		}) => {
			describe(`w/ mocked HttpGet (${descriptionMockedBehavior})`, () => {
				beforeEach(() => {
					jest.spyOn(service, 'getGame')
						.mockImplementation(mockGetGame)
					jest.spyOn(testModule.get(HttpService), 'get')
						.mockImplementation(mockHttpGet)
				})

				afterEach(() => {
					jest.spyOn(service, 'getGame')
						.mockRestore()
					jest.spyOn(testModule.get(HttpService), 'get')
						.mockRestore()
				})

				describe(`invoke getMatchlist("${param1}", "${param2}") [${descriptionParams}]`, () => {
					let actualResult: Game[] | Match[]

					beforeEach(async () => {
						actualResult = await service.getMatchlist(param1, param2, param3, param4)
					})

					it('invokes get(), log(), error() correctly and returns expected result', () => {
						expect(mockError).toHaveBeenCalledTimes(expectedCountError)
						expect(mockLog).toHaveBeenCalledTimes(expectedCountLog)

						expect(mockHttpGet).toHaveBeenCalledTimes(expectedCountGet)
						expect(mockGetGame).toHaveBeenCalledTimes(expectedCountGetGame)

						expect(actualResult).toEqual(expectedResult)
					})
				})
			})
		})
	})
})
