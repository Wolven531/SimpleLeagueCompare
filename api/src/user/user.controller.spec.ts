import { HttpModule, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
// import * as childProcess from 'child_process'

describe('UserController', () => {
	let controller: UserController
	let testModule: TestingModule
	// let UserController: any
	// let mockExecFileSync: jest.Mock

	// beforeAll(() => {
		// mockExecFileSync = jest.fn()
		// jest.spyOn(childProcess, 'execFileSync').mockImplementation(mockExecFileSync)

		// UserController = require('./user.controller').UserController
	// })

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [UserController],
			imports: [HttpModule],
			providers: [
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
		let resp: string

		beforeEach(async () => {
			// mockExecFileSync.mockReset()

			try {
				resp = await controller.refreshUserData()
			} catch (err) {
				capturedError = err
			}
		})

		it('invokes execFileSync(), does NOT throw error', () => {
			expect(capturedError).toBeUndefined()
			// expect(mockExecFileSync).toHaveBeenCalledTimes(1)
			expect(resp).toBe('OK')
		})
	})

	// afterAll(() => {
		// jest.spyOn(childProcess, 'execFileSync').mockRestore()
	// })
})
