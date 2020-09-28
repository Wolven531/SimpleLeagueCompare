import { HttpModule, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigController } from './config.controller'

describe('ConfigController', () => {
	const fakeApiKey = 'some-api-key'
	let controller: ConfigController
	let mockError: jest.Mock
	let mockLog: jest.Mock
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [ConfigController],
			imports: [
				HttpModule,
			],
			providers: [
				{
					provide: ConfigService,
					useFactory: () => ({
						get: jest.fn().mockReturnValueOnce(fakeApiKey),
					}),
				},
				Logger,
			],
		}).compile()

		mockError = jest.fn((msg, ...args) => {})
		mockLog = jest.fn((msg, ...args) => {})

		jest.spyOn(testModule.get(Logger), 'error')
			.mockImplementation(mockError)
		jest.spyOn(testModule.get(Logger), 'log')
			.mockImplementation(mockLog)

		controller = testModule.get(ConfigController)
	})

	afterEach(async () => {
		jest.spyOn(testModule.get(Logger), 'error')
			.mockRestore()
		jest.spyOn(testModule.get(Logger), 'log')
			.mockRestore()
		await testModule.close()
	})

	describe('invoke getConfig()', () => {
		let resp: Record<string, unknown>

		beforeEach(async () => {
			resp = await controller.getConfig()
		})

		it('returns object w/ riotSecret property', () => {
			expect(resp).toEqual({
				riotSecret: fakeApiKey,
			})
		})
	})
})
