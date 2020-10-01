import { HttpModule, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { AppService } from '../services/app.service'
import { AppController } from './app.controller'

type TestCase_IsTokenValid = {
	descriptionMockedBehavior: string
	expectedResult: boolean
	mockIsRiotTokenValid: jest.Mock
}

describe('AppController', () => {
	let controller: AppController
	let mockError: jest.Mock
	let mockLog: jest.Mock
	let mockVerbose: jest.Mock
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [AppController],
			imports: [HttpModule],
			providers: [
				{
					provide: ConfigService,
					useFactory: () => ({
						get: jest.fn().mockReturnValueOnce('some-api-key'),
					}),
				},
				Logger,
				AppService,
			],
		}).compile()

		mockError = jest.fn((msg, ...args) => {})
		mockLog = jest.fn((msg, ...args) => {})
		mockVerbose = jest.fn((msg, ...args) => {})

		jest.spyOn(testModule.get(Logger), 'error')
			.mockImplementation(mockError)
		jest.spyOn(testModule.get(Logger), 'log')
			.mockImplementation(mockLog)
		jest.spyOn(testModule.get(Logger), 'verbose')
			.mockImplementation(mockVerbose)

		controller = testModule.get(AppController)
	})

	afterEach(async () => {
		jest.spyOn(testModule.get(Logger), 'error')
			.mockRestore()
		jest.spyOn(testModule.get(Logger), 'log')
			.mockRestore()
		jest.spyOn(testModule.get(Logger), 'verbose')
			.mockRestore()

		await testModule.close()
	})

	const testCases: TestCase_IsTokenValid[] = [
		{
			descriptionMockedBehavior: 'service method returns true (mocked)',
			expectedResult: true,
			mockIsRiotTokenValid: jest.fn(() => Promise.resolve(true)),
		},
		{
			descriptionMockedBehavior: 'service method returns false (mocked)',
			expectedResult: false,
			mockIsRiotTokenValid: jest.fn(() => Promise.resolve(false)),
		},
	]
	testCases.forEach((
		{
			descriptionMockedBehavior,
			expectedResult,
			mockIsRiotTokenValid,
		}
	) => {
		describe(`invoke isTokenValid() when ${descriptionMockedBehavior}`, () => {
			let actualResult: boolean

			beforeEach(async () => {
				jest.spyOn(testModule.get(AppService), 'isRiotTokenValid')
					.mockImplementation(mockIsRiotTokenValid)

				actualResult = await controller.isTokenValid()
			})

			afterEach(() => {
				jest.spyOn(testModule.get(AppService), 'isRiotTokenValid')
					.mockRestore()
			})

			it('invokes isRiotTokenValid() and returns expected value', () => {
				expect(mockIsRiotTokenValid).toHaveBeenCalledTimes(1)
				expect(actualResult).toBe(expectedResult)
			})
		})
	})
})
