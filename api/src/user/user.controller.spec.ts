import { User } from '@models/user.model'
import { HttpModule, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import childProcess from 'child_process'
import { JsonLoaderService } from '../services/json-loader.service'
import { UserController } from './user.controller'

describe('UserController', () => {
	let controller: UserController
	let mockExecFileSync: jest.Mock
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [UserController],
			imports: [HttpModule],
			providers: [
				JsonLoaderService,
				Logger,
			],
		}).compile()

		controller = testModule.get(UserController)

		mockExecFileSync = jest.fn()

		jest.spyOn(childProcess, 'execFileSync')
			.mockImplementation(mockExecFileSync)
	})

	afterEach(async () => {
		jest.spyOn(childProcess, 'execFileSync')
			.mockRestore()

		await testModule.close()
	})

	describe('invoke refreshUserData()', () => {
		let capturedError: Error
		let resp: string

		beforeEach(async () => {
			try {
				resp = await controller.refreshUserData()
			} catch (err) {
				capturedError = err
			}
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
					.mockImplementationOnce(mockLoadUsersFromFile)

				resp = await controller.getUsers()
			} catch (err) {
				capturedError = err
			}
		})

		it('invokes loadUsersFromFile(), does NOT throw error', () => {
			expect(mockLoadUsersFromFile).toHaveBeenCalledTimes(1)
			expect(capturedError).toBeUndefined()
			expect(resp).toEqual([])
		})
	})
})
