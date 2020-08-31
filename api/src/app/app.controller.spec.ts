import { Test, TestingModule } from '@nestjs/testing'
import { AppService } from '../services/app.service'
import { AppController } from './app.controller'

describe('AppController', () => {
	let appController: AppController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
		}).compile()

		appController = app.get<AppController>(AppController)
	})

	describe('invoke getHello()', () => {
		it('returns "Hello World!"', () => {
			expect(appController.getHello()).toBe('Hello World!')
		})
	})
})
