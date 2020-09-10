import { User } from '@models/user.model'
import { HttpModule, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import fs from 'fs'
import { ENCODING_UTF8 } from '../constants'
import { JsonLoaderService } from '../services/json-loader.service'

type TestCase_GetUserByFriendlyName = {
	expectedCountLog: number
	expectedResult: User | undefined
	mockLoadUsersFromFile: jest.Mock
	name: string
	param: string
}
type TestCase_IsFileFresh = {
	expectedCountError: number
	expectedCountLog: number
	expectedResult: boolean
	mockLoadUsersFromFile: jest.Mock
	name: string
}
type TestCase_LoadFromFile = {
	expectedCountError: number
	expectedCountLog: number
	expectedResult: User[]
	mockReadFileSync: jest.Mock
	name: string
}

describe('JSON Loader Service', () => {
	let service: JsonLoaderService
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [],
			imports: [HttpModule],
			providers: [
				JsonLoaderService,
				Logger,
			],
		}).compile()

		service = testModule.get(JsonLoaderService)
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

		describe('w/ mocked fs.writeFileSync', () => {
			let mockWriteFileSync: jest.Mock

			beforeEach(() => {
				mockWriteFileSync = jest.fn((path, content, opts) => {})

				jest.spyOn(fs, 'writeFileSync')
					.mockImplementation(mockWriteFileSync)
			})

			afterEach(() => {
				jest.spyOn(fs, 'writeFileSync')
					.mockRestore()
			})

			describe('invoke updateUsersFile([]) [w/ empty array]', () => {
				beforeEach(() => {
					service.updateUsersFile([])
				})

				it('logs file info before and after IO update', () => {
					expect(mockWriteFileSync).toHaveBeenCalledTimes(1)
					expect(mockLog).toHaveBeenCalledTimes(2)
					expect(mockError).not.toHaveBeenCalled()
				})
			})
		})

		describe('w/ mocked fs.writeFileSync that throws Error', () => {
			const fakeError = new Error('fake ajw err')
			let mockWriteFileSync: jest.Mock

			beforeEach(() => {
				mockWriteFileSync = jest.fn((path, content, opts) => {
					throw fakeError
				})

				jest.spyOn(fs, 'writeFileSync')
					.mockImplementation(mockWriteFileSync)
			})

			afterEach(() => {
				jest.spyOn(fs, 'writeFileSync')
					.mockRestore()
			})

			describe('invoke updateUsersFile([])', () => {
				beforeEach(() => {
					expect(() => {
						service.updateUsersFile([])
					}).not.toThrow()
				})

				it('logs error and invokes log once (log after update does not execute)', () => {
					expect(mockWriteFileSync).toHaveBeenCalledTimes(1)
					expect(mockLog).toHaveBeenCalledTimes(1)
					expect(mockError).toHaveBeenCalledTimes(1)
				})
			})
		})

		const testCases_GetUserByFriendlyName: TestCase_GetUserByFriendlyName[] = [
			{
				expectedCountLog: 1,
				expectedResult: undefined,
				mockLoadUsersFromFile: jest.fn(() => []),
				name: 'when no users',
				param: 'any name'
			},
			{
				expectedCountLog: 1,
				expectedResult: new User('account-id-1', (new Date(1990, 11, 15)).getTime(), 9, 'name 1', 'summ-id-1'),
				mockLoadUsersFromFile: jest.fn(() => [
					new User('account-id-1', (new Date(1990, 11, 15)).getTime(), 9, 'name 1', 'summ-id-1'),
					new User('account-id-2', (new Date()).getTime(), 12, 'name 2', 'summ-id-2'),
				]),
				name: 'when multiple users, one name matches exactly',
				param: 'name 1',
			},
			{
				expectedCountLog: 1,
				expectedResult: new User('account-id-1', (new Date(1990, 11, 15)).getTime(), 9, 'name 1', 'summ-id-1'),
				mockLoadUsersFromFile: jest.fn(() => [
					new User('account-id-1', (new Date(1990, 11, 15)).getTime(), 9, 'name 1', 'summ-id-1'),
					new User('account-id-2', (new Date()).getTime(), 12, 'name 2', 'summ-id-2'),
				]),
				name: 'when multiple users, one name matches w/ different casing',
				param: 'nAmE 1',
			},
			{
				expectedCountLog: 1,
				expectedResult: undefined,
				mockLoadUsersFromFile: jest.fn(() => [
					new User('account-id-1', (new Date()).getTime(), 9, 'name 1', 'summ-id-1'),
					new User('account-id-2', (new Date()).getTime(), 12, 'name 2', 'summ-id-2'),
				]),
				name: 'when multiple users, none match',
				param: 'non-matching name',
			},
		]
		testCases_GetUserByFriendlyName.forEach(({ expectedCountLog, expectedResult, mockLoadUsersFromFile, name, param }) => {
			describe(`w/ mocked loadUsersFromFile (${name})`, () => {	
				beforeEach(() => {
					jest.spyOn(service, 'loadUsersFromFile')
						.mockImplementation(mockLoadUsersFromFile)
				})
	
				afterEach(() => {
					jest.spyOn(service, 'loadUsersFromFile')
						.mockRestore()
				})
	
				describe(`invoke getUserByFriendlyName("${param}")`, () => {
					let actualResult: User | undefined
	
					beforeEach(() => {
						actualResult = service.getUserByFriendlyName(param)
					})
	
					it('invokes loadUsersFromFile, log, error correctly and returns expected result', () => {
						expect(mockLoadUsersFromFile).toHaveBeenCalledTimes(1)
						expect(mockLog).toHaveBeenCalledTimes(expectedCountLog)
						expect(actualResult).toEqual(expectedResult)
					})
				})
			})
		})

		const testCases_IsFileFresh: TestCase_IsFileFresh[] = [
			{
				expectedCountError: 0,
				expectedCountLog: 1,
				expectedResult: true,
				mockLoadUsersFromFile: jest.fn(() => []),
				name: 'when no users',
			},
			{
				expectedCountError: 0,
				expectedCountLog: 1,
				expectedResult: true,
				mockLoadUsersFromFile: jest.fn(() => [
					new User('account-id-1', (new Date()).getTime(), 9, 'name 1', 'summ-id-1'),
					new User('account-id-2', (new Date()).getTime(), 12, 'name 2', 'summ-id-2'),
				]),
				name: 'when multiple users, all fresh',
			},
			{
				expectedCountError: 0,
				expectedCountLog: 1,
				expectedResult: false,
				mockLoadUsersFromFile: jest.fn(() => [
					new User('account-id-1', (new Date()).getTime(), 9, 'name 1', 'summ-id-1'),
					new User('account-id-2', (new Date(1990, 11, 15)).getTime(), 12, 'name 2', 'summ-id-2'),
				]),
				name: 'when multiple users, one is stale',
			},
		]
		testCases_IsFileFresh.forEach(({ expectedCountError, expectedCountLog, expectedResult, mockLoadUsersFromFile, name }) => {
			describe(`w/ mocked loadUsersFromFile (${name})`, () => {	
				beforeEach(() => {	
					jest.spyOn(service, 'loadUsersFromFile')
						.mockImplementation(mockLoadUsersFromFile)
				})
	
				afterEach(() => {
					jest.spyOn(service, 'loadUsersFromFile')
						.mockRestore()
				})
	
				describe('invoke isUsersFileFresh()', () => {
					let actualResult: boolean
	
					beforeEach(() => {
						actualResult = service.isUsersFileFresh()
					})
	
					it('invokes loadUsersFromFile, log, error correctly and returns expected result', () => {
						expect(mockLoadUsersFromFile).toHaveBeenCalledTimes(1)
						expect(mockLog).toHaveBeenCalledTimes(expectedCountLog)
						expect(mockError).toHaveBeenCalledTimes(expectedCountError)
						expect(actualResult).toEqual(expectedResult)
					})
				})
			})
		})

		const testCases_LoadFromFile: TestCase_LoadFromFile[] = [
			{
				expectedCountError: 0,
				expectedCountLog: 1,
				expectedResult: [],
				mockReadFileSync: jest.fn((path) =>
					Buffer.from(
						JSON.stringify([]),
						ENCODING_UTF8)
				),
				name: 'empty array',
			},
			{
				expectedCountError: 0,
				expectedCountLog: 1,
				expectedResult: [
					new User('account-id-1', 1599444327317, 9, 'name 1', 'summ-id-1'),
				],
				mockReadFileSync: jest.fn((path) =>
					Buffer.from(
						JSON.stringify([
							new User('account-id-1', 1599444327317, 9, 'name 1', 'summ-id-1'),
						]),
						ENCODING_UTF8)
				),
				name: 'non-empty array',
			},
			{
				expectedCountError: 1,
				expectedCountLog: 0,
				expectedResult: [],
				mockReadFileSync: jest.fn((path) => {
					throw new Error('fake ajw err')
				}),
				name: 'throws error'
			},
		]
		testCases_LoadFromFile.forEach(({ expectedCountError, expectedCountLog, expectedResult, mockReadFileSync, name }) => {
			describe(`w/ mocked fs.readFileSync (${name})`, () => {	
				beforeEach(() => {	
					jest.spyOn(fs, 'readFileSync')
						.mockImplementation(mockReadFileSync)
				})
	
				afterEach(() => {
					jest.spyOn(fs, 'readFileSync')
						.mockRestore()
				})
	
				describe('invoke loadUsersFromFile()', () => {
					let actualResult: User[]
	
					beforeEach(() => {
						actualResult = service.loadUsersFromFile()
					})
	
					it('invokes read, log, error correctly and returns expected result', () => {
						expect(mockReadFileSync).toHaveBeenCalledTimes(1)
						expect(mockLog).toHaveBeenCalledTimes(expectedCountLog)
						expect(mockError).toHaveBeenCalledTimes(expectedCountError)
						expect(actualResult).toEqual(expectedResult)
					})
				})
			})
		})
	})
})
