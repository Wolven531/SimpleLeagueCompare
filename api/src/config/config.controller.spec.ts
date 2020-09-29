import { HttpModule, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { AppService } from '../services/app.service'
import { ConfigController } from './config.controller'

describe('ConfigController', () => {
	const fakeApiKey = 'some-api-key'
	let controller: ConfigController
	let mockError: jest.Mock
	let mockLog: jest.Mock
	let mockVerbose: jest.Mock
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
				{
					provide: AppService,
					useFactory: () => ({
						getHello: jest.fn(() => 'mocked hello'),
						isRiotTokenValid: jest.fn(() => Promise.resolve(true)),
					}) as Partial<AppService>,
				},
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

		controller = testModule.get(ConfigController)
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

	describe('invoke getConfig()', () => {
		let resp: Record<string, string>

		beforeEach(async () => {
			resp = await controller.getConfig()
		})

		it('returns object w/ riotSecret property', () => {
			expect(resp).toEqual({
				riotSecret: fakeApiKey,
			})
		})
	})

	describe('invoke isTokenValid()', () => {
		let resp: boolean

		beforeEach(async () => {
			resp = await controller.isTokenValid()
		})

		it('invokes appService method and returns true (mocked value)', () => {
			expect(resp).toBe(true)
		})
	})
})
