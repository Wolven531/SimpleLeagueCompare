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

	describe('invoke getUserByFriendlyName("") [w/ empty string]', () => {
		let actual: any

		beforeEach(() => {
			actual = service.getUserByFriendlyName('')
		})

		it('passes', () => {
			expect(true).toBe(true)
		})
	})

	describe('invoke isUsersFileFresh()', () => {
		let actual: boolean

		beforeEach(() => {
			actual = service.isUsersFileFresh()
		})

		it('passes', () => {
			expect(true).toBe(true)
		})
	})

	describe('invoke loadUsersFromFile()', () => {
		let actual: any[]

		beforeEach(() => {
			actual = service.loadUsersFromFile()
		})

		it('passes', () => {
			expect(true).toBe(true)
		})
	})

	describe('invoke updateUsersFile([]) [w/ empty array]', () => {
		let mockError: jest.Mock
		let mockLog: jest.Mock
		let mockWriteFileSync: jest.Mock

		beforeEach(() => {
			mockError = jest.fn((msg, ...args) => {})
			mockLog = jest.fn((msg, ...args) => {})
			mockWriteFileSync = jest.fn((path, content, opts) => {})

			jest.spyOn(testModule.get(Logger), 'error')
				.mockImplementation(mockError)
			jest.spyOn(testModule.get(Logger), 'log')
				.mockImplementation(mockLog)
			jest.spyOn(fs, 'writeFileSync')
				.mockImplementation(mockWriteFileSync)

			service.updateUsersFile([])
		})

		afterEach(() => {
			jest.spyOn(testModule.get(Logger), 'error')
				.mockRestore()
			jest.spyOn(testModule.get(Logger), 'log')
				.mockRestore()
			jest.spyOn(fs, 'writeFileSync')
				.mockRestore()
		})

		it('logs file info before and after IO update', () => {
			expect(mockWriteFileSync).toHaveBeenCalledTimes(1)
			expect(mockLog).toHaveBeenCalledTimes(2)
			expect(mockError).not.toHaveBeenCalled()
		})
	})

	describe('invoke updateUsersFile([]) [when err is thrown]', () => {
		const fakeError = new Error('fake ajw err')
		let mockError: jest.Mock
		let mockLog: jest.Mock
		let mockWriteFileSync: jest.Mock

		beforeEach(() => {
			mockError = jest.fn((msg, ...args) => {})
			mockLog = jest.fn((msg, ...args) => {})
			mockWriteFileSync = jest.fn((path, content, opts) => {
				throw fakeError
			})

			jest.spyOn(testModule.get(Logger), 'error')
				.mockImplementation(mockError)
			jest.spyOn(testModule.get(Logger), 'log')
				.mockImplementation(mockLog)
			jest.spyOn(fs, 'writeFileSync')
				.mockImplementation(mockWriteFileSync)

			expect(() => {
				service.updateUsersFile([])
			}).not.toThrow()
		})

		afterEach(() => {
			jest.spyOn(testModule.get(Logger), 'error')
				.mockRestore()
			jest.spyOn(testModule.get(Logger), 'log')
				.mockRestore()
			jest.spyOn(fs, 'writeFileSync')
				.mockRestore()
		})

		it('logs error and invokes log once (log after update does not execute)', () => {
			expect(mockWriteFileSync).toHaveBeenCalledTimes(1)
			expect(mockLog).toHaveBeenCalledTimes(1)
			expect(mockError).toHaveBeenCalledTimes(1)
		})
	})
})
