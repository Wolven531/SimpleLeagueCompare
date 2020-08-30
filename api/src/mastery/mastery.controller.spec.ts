import { HttpModule, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { JsonLoaderService } from '../services/json-loader.service'
import { MatchlistService } from '../services/matchlist.service'
import { MasteryController } from './mastery.controller'

describe('MasteryController', () => {
	let controller: MasteryController
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [MasteryController],
			imports: [HttpModule],
			providers: [
				ConfigService,
				JsonLoaderService,
				Logger,
				MatchlistService,
			],
		}).compile()

		controller = testModule.get(MasteryController)
	})

	afterEach(async () => {
		await testModule.close()
	})

	describe('invoke getMasteryTotal w/ empty string', () => {
		let resp: number
		
		beforeEach(async () => {
			resp = await controller.getMasteryTotal('')
		})

		it('returns -1', () => {
			expect(resp).toBe(-1)
		})
	})
})
