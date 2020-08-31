import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigController } from './config.controller'

describe('ConfigController', () => {
	let controller: ConfigController
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [ConfigController],
			imports: [],
			providers: [
				{
					provide: ConfigService,
					useFactory: () => ({
						get: jest.fn().mockReturnValueOnce('some-api-key'),
					}),
				},
				Logger,
			],
		}).compile()

		controller = testModule.get(ConfigController)
	})

	afterEach(async () => {
		await testModule.close()
	})

	describe('invoke getMasteryTotal w/ empty string', () => {
		let resp: {}
		
		beforeEach(async () => {
			resp = await controller.getConfig()
		})

		it('returns object w/ riotSecret property', () => {
			expect(resp).toEqual({
				riotSecret: 'some-api-key',
			})
		})
	})
})
