import { CalculatedStats } from '@models/calculated-stats.model'
import { Game } from '@models/game.model'
import { Participant } from '@models/participant.model'
import { Stats } from '@models/stats.model'
import { Team } from '@models/team.model'
import { Timeline } from '@models/timeline.model'
import { HttpModule, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { generateParticipantIdentity, toggleMockedLogger } from '../../test/utils'
import { StatsService } from './stats.service'

type TestCase_CalculateGeneralStats = {
	expectedResult: CalculatedStats
	name: string
	param1: string
	param2: Game[]
}

describe('Stats Service', () => {
	const fakeGame = new Game(
		(new Date()).getTime(),
		60 * 20,
		1,
		'',
		'',
		'',
		0,
		[
			generateParticipantIdentity(1),
			generateParticipantIdentity(2),
		],
		[
			new Participant(
				1,
				100,
				266, // Aatrox ?
				7, // SummonerHeal - http://ddragon.leagueoflegends.com/cdn/10.18.1/data/en_US/summoner.json
				4, // SummonerFlash
				{
					assists: 10,
					deaths: 1,
					goldEarned: 9000,
					kills: 10,
					win: true,
				} as Stats,
				new Timeline(1, {}, {}, {}, {}, {}, {}, {}, 'SUPPORT', 'BOTTOM'),
			),
			new Participant(
				2,
				200,
				266, // Aatrox ?
				4, // SummonerFlash
				7, // SummonerHeal - http://ddragon.leagueoflegends.com/cdn/10.18.1/data/en_US/summoner.json
				{
					assists: 1,
					deaths: 10,
					goldEarned: 3000,
					kills: 1,
					win: false,
				} as Stats,
				new Timeline(2, {}, {}, {}, {}, {}, {}, {}, 'SUPPORT', 'TOP'),
			),
		],
		'p',
		0,
		2020,
		[
			new Team(100, 'win', true, true, true, true, true, true, 5, 1, 1, 1, 0, 1, 0, []),
			new Team(200, 'loss', false, false, false, false, false, false, 1, 0, 0, 0, 0, 0, 0, []),
		]
	)
	const testCases_CalculateGeneralStats: TestCase_CalculateGeneralStats[] = [
		{
			expectedResult: new CalculatedStats(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
			name: 'empty account id and empty games array',
			param1: '',
			param2: [],
		},
		{
			expectedResult: new CalculatedStats(1, 9000, 9000, 20, 1200, 1200, 10, 10, 1, 1, 10, 10, 0, 1, 100),
			name: 'a single Game (w/ a win that matches)',
			param1: 'a1',
			param2: [ fakeGame ],
		},
		{
			expectedResult: new CalculatedStats(1, 3000, 3000, 0.2, 1200, 1200, 1, 1, 10, 10, 1, 1, 1, 0, 0),
			name: 'a single Game (w/ a loss that matches)',
			param1: 'a2',
			param2: [ fakeGame ],
		},
		{
			expectedResult: new CalculatedStats(1, 0, 0, 0, 1200, 1200, 0, 0, 0, 0, 0, 0, 1, 0, 0),
			name: 'a single Game (w/ no identity matches)',
			param1: 'a3',
			param2: [ fakeGame ],
		},
		{
			expectedResult: new CalculatedStats(1, 0, 0, 0, 1200, 1200, 0, 0, 0, 0, 0, 0, 1, 0, 0),
			name: 'a single Game (w/ no participant matches)',
			param1: 'a3',
			param2: [
				{
					...fakeGame,
					participantIdentities: fakeGame.participantIdentities.concat(generateParticipantIdentity(3)),
				},
			],
		},
	]
	let service: StatsService
	let testModule: TestingModule

	beforeEach(async () => {
		testModule = await Test.createTestingModule({
			controllers: [],
			imports: [HttpModule],
			providers: [
				StatsService,
				Logger,
			],
		}).compile()

		service = testModule.get(StatsService)
	})

	afterEach(async () => {
		await testModule.close()
	})

	describe('w/ mocked logger functions [ debug, error, log, verbose ]', () => {
		beforeEach(() => {
			toggleMockedLogger(testModule)
		})

		afterEach(() => {
			toggleMockedLogger(testModule, false)
		})

		testCases_CalculateGeneralStats.forEach(({ expectedResult, param1, param2, name }) => {
			describe(`invoke calculateGeneralStats("${param1}", ${param2.length} games) [${name}]`, () => {
				let actualResult: CalculatedStats

				beforeEach(() => {
					actualResult = service.calculateGeneralStats(param1, param2)
				})

				it('returns expected CalculatedStats', () => {
					expect(actualResult).toEqual(expectedResult)
				})
			})
		})
	})
})
