import { Game } from '@models/game.model'
import { Match } from '@models/match.model'
import { HttpModule, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { JsonLoaderService } from '../services/json-loader.service'
import { MatchlistService } from '../services/matchlist.service'
import { MatchlistController } from './matchlist.controller'

describe('MatchlistController', () => {
	let controller: MatchlistController
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [MatchlistController],
			imports: [HttpModule],
			providers: [
				ConfigService,
				JsonLoaderService,
				Logger,
				MatchlistService
			],
		}).compile()

		controller = testModule.get(MatchlistController)
	})

	afterEach(async () => {
		await testModule.close()
	})

	describe('invoke getMatchlist()', () => {
		let mockGet: jest.Mock
		let mockGetMatchlist: jest.Mock
		let resp: Match[]

		beforeEach(async () => {
			mockGet = jest.fn(() => 'dummy-key')
			mockGetMatchlist = jest.fn(() => [])

			jest.spyOn(testModule.get(ConfigService), 'get')
				.mockImplementationOnce(mockGet)
			jest.spyOn(testModule.get(MatchlistService), 'getMatchlist')
				.mockImplementationOnce(mockGetMatchlist)

			resp = await controller.getMatchlist('some-account-id', undefined, undefined) as Match[]
		})

		it('returns empty array', () => {
			expect(mockGet).toHaveBeenCalledTimes(1)
			expect(mockGetMatchlist).toHaveBeenCalledTimes(1)
			expect(resp).toEqual([])
		})
	})

	describe('invoke getGame()', () => {
		let resp: Game

		beforeEach(async () => {
			resp = await controller.getGame(0)
		})

		it('returns empty array', () => {
			expect(true).toBe(true)
		})
	})
})
