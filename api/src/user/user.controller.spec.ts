import { Summoner } from '@models/summoner.model'
import { User } from '@models/user.model'
// import { HttpModule, HttpService, HttpStatus, Logger } from '@nestjs/common'
import { HttpModule, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
// import { AxiosResponse } from 'axios'
import childProcess from 'child_process'
import { JsonLoaderService } from '../services/json-loader.service'
import { SummonerService } from '../services/summoner.service'
import { UserController } from './user.controller'

describe('UserController', () => {
	let controller: UserController
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [UserController],
			imports: [HttpModule],
			providers: [
				ConfigService,
				JsonLoaderService,
				SummonerService,
				Logger,
			],
		}).compile()

		controller = testModule.get(UserController)
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
			mockDebug = jest.fn()
			mockError = jest.fn()
			mockLog = jest.fn()
			mockVerbose = jest.fn()

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

		describe('invoke refreshUserData()', () => {
			let capturedError: Error
			let mockExecFileSync: jest.Mock
			let resp: string

			beforeEach(async () => {
				mockExecFileSync = jest.fn()

				try {
					jest.spyOn(childProcess, 'execFileSync')
						.mockImplementation(mockExecFileSync)

					resp = await controller.refreshUserData()
				} catch (err) {
					capturedError = err
				}
			})

			afterEach(() => {
				jest.spyOn(childProcess, 'execFileSync')
					.mockRestore()
			})

			it('invokes execFileSync(), does NOT throw error', () => {
				expect(mockExecFileSync).toHaveBeenCalledTimes(1)
				expect(capturedError).toBeUndefined()
				expect(resp).toBe('OK')
			})
		})

		describe('invoke getUsers()', () => {
			let capturedError: Error
			let mockLoadUsersFromFile: jest.Mock
			let resp: User[]

			beforeEach(async () => {
				mockLoadUsersFromFile = jest.fn(() => [])

				try {
					jest.spyOn(testModule.get(JsonLoaderService), 'loadUsersFromFile')
						.mockImplementation(mockLoadUsersFromFile)

					resp = await controller.getUsers()
				} catch (err) {
					capturedError = err
				}
			})

			afterEach(() => {
				jest.spyOn(testModule.get(JsonLoaderService), 'loadUsersFromFile')
					.mockRestore()
			})

			it('invokes loadUsersFromFile(), does NOT throw error', () => {
				expect(mockLoadUsersFromFile).toHaveBeenCalledTimes(1)
				expect(capturedError).toBeUndefined()
				expect(resp).toEqual([])
			})
		})

		describe('invoke searchUsers()', () => {
			let capturedError: Error
			// let mockHttpServiceGet: jest.Mock
			let mockSearchByName: jest.Mock
			let resp: Summoner | null

			beforeEach(async () => {
				// mockHttpServiceGet = jest.fn(() =>
				// 	Promise.resolve({
				// 		data: {} as Summoner,
				// 		status: HttpStatus.OK,
				// 	} as AxiosResponse<Summoner>))
				mockSearchByName = jest.fn(() => Promise.resolve({ name: 'nameForWhichToSearch' } as Summoner))

				try {
					// jest.spyOn(testModule.get(HttpService), 'get')
					// 	.mockImplementation(mockHttpServiceGet)
					jest.spyOn(testModule.get(SummonerService), 'searchByName')
						.mockImplementation(mockSearchByName)

					resp = await controller.searchUsers('nameForWhichToSearch')
				} catch (err) {
					capturedError = err
				}
			})

			afterEach(() => {
				// jest.spyOn(testModule.get(HttpService), 'get')
				// 	.mockRestore()
				jest.spyOn(testModule.get(SummonerService), 'searchByName')
					.mockRestore()
			})

			it('invokes SummonerService.searchByName(), does NOT throw error', () => {
				// expect(mockHttpServiceGet).toHaveBeenCalledTimes(1)
				expect(mockSearchByName).toHaveBeenCalledTimes(1)
				expect(mockSearchByName).toHaveBeenLastCalledWith('nameForWhichToSearch')
				expect(capturedError).toBeUndefined()
				expect(resp).toEqual({ name: 'nameForWhichToSearch' } as Summoner)
			})
		})
	})
})
