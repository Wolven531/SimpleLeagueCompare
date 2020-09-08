import { HttpModule, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { JsonLoaderService } from '../services/json-loader.service'

describe('JSON Loader Service', () => {
	let service: JsonLoaderService
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [],
			imports: [HttpModule],
			providers: [
				JsonLoaderService,
				Logger,
			],
		}).compile()

		service = testModule.get(JsonLoaderService)
	})

	afterEach(async () => {
		await testModule.close()
	})

	describe('invoke loadUsersFromFile()', () => {
		let actual: any[]

		beforeEach(() => {
			actual = service.loadUsersFromFile()
		})

		it('passes', () => {
			expect(true).toBe(true)
		})
	})
})
