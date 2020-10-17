import { User } from '@models/user.model'
import { HttpModule, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
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
})
