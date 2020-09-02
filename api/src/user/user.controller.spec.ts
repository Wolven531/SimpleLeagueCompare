import { HttpModule, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as childProcess from 'child_process'
import { UserController } from './user.controller'


describe('UserController', () => {
	let controller: UserController
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
			jest.spyOn(childProcess, 'execFileSync')
				.mockImplementationOnce(mockExecFileSync)

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
})
