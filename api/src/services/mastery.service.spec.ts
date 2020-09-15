import { User } from '@models/user.model'
import { HttpModule, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import fs from 'fs'
import { ENCODING_UTF8 } from '../constants'
import { JsonLoaderService } from './json-loader.service'
import { MasteryService } from './mastery.service'

type TestCase_GetMasteryTotal = {
	descriptionMockedBehavior: string
	descriptionParams: string
	expectedCountError: number
	expectedCountLog: number
	expectedResult: number
	mockLoadUsersFromFile: jest.Mock
	param1: string
	param2: string
	param3: number | undefined
}

describe('Mastery Service', () => {
	let service: MasteryService
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [],
			imports: [HttpModule],
			providers: [
				JsonLoaderService,
				MasteryService,
				Logger,
			],
		}).compile()

		service = testModule.get(MasteryService)
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

		const testCases_getMasteryTotal: TestCase_GetMasteryTotal[] = [
			{
				descriptionMockedBehavior: 'empty array of Users',
				descriptionParams: 'empty API key, empty summonerId, undefined defaultMasteryTotal',
				expectedCountError: 1,
				expectedCountLog: 0,
				expectedResult: -1, // comes from DEFAULT_TOTAL_MASTERY_SCORE
				mockLoadUsersFromFile: jest.fn(() => []),
				param1: '',
				param2: '',
				param3: undefined,
			},
		]
		testCases_getMasteryTotal.forEach((
			{
				descriptionMockedBehavior,
				descriptionParams,
				expectedCountError,
				expectedCountLog,
				expectedResult,
				mockLoadUsersFromFile,
				param1,
				param2,
				param3,
			}) => {
			describe(`w/ mocked loadUsersFromFile (${descriptionMockedBehavior})`, () => {	
				beforeEach(() => {
					jest.spyOn(testModule.get(JsonLoaderService), 'loadUsersFromFile')
						.mockImplementation(mockLoadUsersFromFile)
				})
	
				afterEach(() => {
					jest.spyOn(testModule.get(JsonLoaderService), 'loadUsersFromFile')
						.mockRestore()
				})
	
				describe(`invoke getMasteryTotal("${param1}", "${param2}", "${param3}") [${descriptionParams}]`, () => {
					let actualResult: number
	
					beforeEach(async () => {
						actualResult = await service.getMasteryTotal(param1, param2, param3)
					})
	
					it('invokes loadUsersFromFile, log, error correctly and returns expected result', () => {
						expect(mockLoadUsersFromFile).toHaveBeenCalledTimes(1)
						expect(mockError).toHaveBeenCalledTimes(expectedCountError)
						expect(mockLog).toHaveBeenCalledTimes(expectedCountLog)
						expect(actualResult).toEqual(expectedResult)
					})
				})
			})
		})

	})
})
