import { HttpModule, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { JsonLoaderService } from '../services/json-loader.service'
import { MasteryService } from '../services/mastery.service'
import { MasteryController } from './mastery.controller'

describe('MasteryController', () => {
	let controller: MasteryController
	let mockError: jest.Mock
	let mockLog: jest.Mock
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [MasteryController],
			imports: [HttpModule],
			providers: [
				ConfigService,
				JsonLoaderService,
				Logger,
				MasteryService,
			],
		}).compile()

		mockError = jest.fn((msg, ...args) => {})
		mockLog = jest.fn((msg, ...args) => {})

		jest.spyOn(testModule.get(Logger), 'error')
			.mockImplementation(mockError)
		jest.spyOn(testModule.get(Logger), 'log')
			.mockImplementation(mockLog)

		controller = testModule.get(MasteryController)
	})

	afterEach(async () => {
		jest.spyOn(testModule.get(Logger), 'error')
			.mockRestore()
		jest.spyOn(testModule.get(Logger), 'log')
			.mockRestore()
		await testModule.close()
	})

	describe('invoke getMasteryTotal("") (w/ empty string)', () => {
		let resp: number

		beforeEach(async () => {
			resp = await controller.getMasteryTotal('')
		})

		it('returns -1', () => {
			expect(resp).toBe(-1)
		})
	})
})
