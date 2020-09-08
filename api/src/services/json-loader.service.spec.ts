import { User } from '@models/user.model'
import { HttpModule, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import fs from 'fs'
import { JsonLoaderService } from '../services/json-loader.service'

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

		xdescribe('invoke loadUsersFromFile()', () => {
			let actual: User[]

			beforeEach(() => {
				actual = service.loadUsersFromFile()
			})

			it('passes', () => {
				expect(true).toBe(true)
			})
		})
	})
})
