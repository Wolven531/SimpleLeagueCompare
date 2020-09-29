import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { AppService } from '../services/app.service'
import { AppController } from './app.controller'

describe('AppController', () => {
	const fakeApiKey = 'some-api-key'
	let appController: AppController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
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

		appController = app.get<AppController>(AppController)
	})

	describe('invoke getHello()', () => {
		let actual: string

		beforeEach(() => {
			actual = appController.getHello()
		})

		it('returns "Hello World!"', () => {
			expect(actual).toBe('mocked hello')
		})
	})
})
