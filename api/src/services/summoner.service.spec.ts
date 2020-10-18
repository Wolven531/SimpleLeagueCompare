import { Summoner } from '@models/summoner.model'
import { HttpModule, HttpService, HttpStatus, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { AxiosResponse } from 'axios'
import { from } from 'rxjs'
import { SummonerService } from './summoner.service'

type TestCase_SearchByName = {
	descriptionMockedBehavior: string
	expectedCountDebug: number
	expectedCountError: number
	expectedCountGet: number
	expectedCountLog: number
	expectedCountVerbose: number
	expectedResult: Summoner | null
	mockHttpGet: jest.Mock
	param: string
}

describe('Summoner Service', () => {
	let service: SummonerService
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [],
			imports: [HttpModule],
			providers: [
				{
					provide: ConfigService,
					useFactory: () => ({
						get: jest.fn().mockReturnValue('some-api-key'),
					}),
				},
				SummonerService,
				Logger,
			],
		}).compile()

		service = testModule.get(SummonerService)
	})

	afterEach(async () => {
		await testModule.close()
	})

	describe('w/ mocked logger functions [ debug, error, log, verbose ]', () => {
		let mockDebug: jest.Mock
		let mockError: jest.Mock
		let mockLog: jest.Mock
		let mockVerbose: jest.Mock

		beforeEach(() => {
			mockDebug = jest.fn((msg, ...args) => {})
			mockError = jest.fn((msg, ...args) => {})
			mockLog = jest.fn((msg, ...args) => {})
			mockVerbose = jest.fn((msg, ...args) => {})

			jest.spyOn(testModule.get(Logger), 'debug')
				.mockImplementation(mockDebug)
			jest.spyOn(testModule.get(Logger), 'error')
				.mockImplementation(mockError)
			jest.spyOn(testModule.get(Logger), 'log')
				.mockImplementation(mockLog)
			jest.spyOn(testModule.get(Logger), 'verbose')
				.mockImplementation(mockVerbose)
		})

		afterEach(() => {
			jest.spyOn(testModule.get(Logger), 'debug')
				.mockRestore()
			jest.spyOn(testModule.get(Logger), 'error')
				.mockRestore()
			jest.spyOn(testModule.get(Logger), 'log')
				.mockRestore()
			jest.spyOn(testModule.get(Logger), 'verbose')
				.mockRestore()
		})

		const testCases_searchByName: TestCase_SearchByName[] = [
			{
				descriptionMockedBehavior: 'request fails',
				expectedCountDebug: 1,
				expectedCountError: 0,
				expectedCountGet: 1,
				expectedCountLog: 0,
				expectedCountVerbose: 2,
				expectedResult: null,
				mockHttpGet: jest.fn(() => from(Promise.reject(new Error('fake AJW error')))),
				param: '',
			},
			{
				descriptionMockedBehavior: 'request succeeds w/ NOT_FOUND',
				expectedCountDebug: 2,
				expectedCountError: 0,
				expectedCountGet: 1,
				expectedCountLog: 0,
				expectedCountVerbose: 2,
				expectedResult: null,
				mockHttpGet: jest.fn(() => from(Promise.resolve({ status: HttpStatus.NOT_FOUND } as AxiosResponse))),
				param: '',
			},
		]
		testCases_searchByName.forEach((
			{
				descriptionMockedBehavior,
				expectedCountDebug,
				expectedCountError,
				expectedCountGet,
				expectedCountLog,
				expectedCountVerbose,
				expectedResult,
				mockHttpGet,
				param,
			}) => {
			describe(`w/ mocked HTTP Get (${descriptionMockedBehavior})`, () => {	
				beforeEach(() => {
					jest.spyOn(testModule.get(HttpService), 'get')
						.mockImplementation(mockHttpGet)
				})

				afterEach(() => {
					jest.spyOn(testModule.get(HttpService), 'get')
						.mockRestore()
				})

				describe('invoke searchByName()', () => {
					let actualResult: Summoner | null

					beforeEach(async () => {
						actualResult = await service.searchByName(param)
					})

					it('invokes get(), log(), error(), debug(), verbose() correctly and returns expected result', () => {
						expect(mockDebug).toHaveBeenCalledTimes(expectedCountDebug)
						expect(mockError).toHaveBeenCalledTimes(expectedCountError)
						expect(mockLog).toHaveBeenCalledTimes(expectedCountLog)
						expect(mockVerbose).toHaveBeenCalledTimes(expectedCountVerbose)

						expect(mockHttpGet).toHaveBeenCalledTimes(expectedCountGet)

						if (expectedCountGet > 0) {
							expect(mockHttpGet).toHaveBeenLastCalledWith(
								'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/',
								{
									headers: {
										'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
										'Accept-Language': 'en-US,en;q=0.9',
										'X-Riot-Token': 'some-api-key',
									},
								})
						}

						expect(actualResult).toEqual(expectedResult)
					})
				})
			})
		})
	})
})
