import { User } from '@models/user.model'
import { HttpModule, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import fs from 'fs'
import { ENCODING_UTF8 } from '../constants'
import { JsonLoaderService } from '../services/json-loader.service'

type TestCase_LoadFromFile = {
	countError: number
	countLog: number
	expected: User[]
	impl: jest.Mock
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

		const testCases_LoadFromFile: TestCase_LoadFromFile[] = [
			{
				countError: 0,
				countLog: 1,
				expected: [],
				impl: jest.fn((path) =>
					Buffer.from(
						JSON.stringify([]),
						ENCODING_UTF8)
				),
				name: 'empty array',
			},
			{
				countError: 0,
				countLog: 1,
				expected: [
					new User('account-id-1', 1599444327317, 9, 'name 1', 'summ-id-1'),
				],
				impl: jest.fn((path) =>
					Buffer.from(
						JSON.stringify([
							new User('account-id-1', 1599444327317, 9, 'name 1', 'summ-id-1'),
						]),
						ENCODING_UTF8)
				),
				name: 'non-empty array',
			},
			{
				countError: 1,
				countLog: 0,
				expected: [],
				impl: jest.fn((path) => {
					throw new Error('fake ajw err')
				}),
				name: 'throws error'
			},
		]
		testCases_LoadFromFile.forEach(({ countError, countLog, expected, impl, name }) => {
			describe(`w/ mocked fs.readFileSync (${name})`, () => {
				let mockReadFileSync: jest.Mock
	
				beforeEach(() => {
					mockReadFileSync = impl
	
					jest.spyOn(fs, 'readFileSync')
						.mockImplementation(mockReadFileSync)
				})
	
				afterEach(() => {
					jest.spyOn(fs, 'readFileSync')
						.mockRestore()
				})
	
				describe('invoke loadUsersFromFile()', () => {
					let actual: User[]
	
					beforeEach(() => {
						actual = service.loadUsersFromFile()
					})
	
					it('logs file info before and after IO update', () => {
						expect(mockReadFileSync).toHaveBeenCalledTimes(1)
						expect(mockLog).toHaveBeenCalledTimes(countLog)
						expect(mockError).toHaveBeenCalledTimes(countError)
						expect(actual).toEqual(expected)
					})
				})
			})
		})

		xdescribe('invoke getUserByFriendlyName("") [w/ empty string]', () => {
			let actual: User | undefined

			beforeEach(() => {
				actual = service.getUserByFriendlyName('')
			})

			it('passes', () => {
				expect(true).toBe(true)
			})
		})

		xdescribe('invoke isUsersFileFresh()', () => {
			let actual: boolean

			beforeEach(() => {
				actual = service.isUsersFileFresh()
			})

			it('passes', () => {
				expect(true).toBe(true)
			})
		})
	})
})
