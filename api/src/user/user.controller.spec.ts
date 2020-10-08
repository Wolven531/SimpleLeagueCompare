import { HttpModule, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import childProcess from 'child_process'
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
})
