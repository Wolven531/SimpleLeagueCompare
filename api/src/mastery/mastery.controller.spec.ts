import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { MatchlistService } from '../services/matchlist.service'
import { MasteryController } from './mastery.controller'

describe('MasteryController', () => {
	let controller: MasteryController
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [MasteryController],
			providers: [
				ConfigService,
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

		it('returns 0', () => {
			expect(resp).toBe(0)
		})
	})
})
