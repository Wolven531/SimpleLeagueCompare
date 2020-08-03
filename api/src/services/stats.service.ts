import {
	Inject,
	Injectable,
	Logger,
	LoggerService
} from '@nestjs/common'
import { CalculatedStats } from '@models/calculated-stats.model'
import { Game } from '@models/game.model'

@Injectable()
export class StatsService {
	constructor(
		@Inject(Logger)
		private readonly logger: LoggerService,
	) { }

	calculateGeneralStats(targetAccountKey: string, games: Game[]): CalculatedStats {
		const FUNC = ' calculateGeneralStats | StatsSvc '

		this.logger.log(`About to calc stats for ${games.length} games w/ account = ${targetAccountKey}...`, FUNC)

		const timePlayedTotal = games.map(g => g.gameDuration).reduce((acc, curr) => acc + curr)
		const timePlayedAvg = timePlayedTotal / games.length

		let assistsTotal = 0
		let deathsTotal = 0
		let goldEarnedTotal = 0
		let killsTotal = 0
		let totalWins = 0

		games.forEach(g => {
			const identity = g.participantIdentities.find(i => i.player.currentAccountId === targetAccountKey);

			if (!identity) {
				return
			}

			const participant = g.participants.find(p => p.participantId === identity.participantId)

			if (!participant) {
				return
			}

			assistsTotal += participant.stats.assists
			deathsTotal += participant.stats.deaths
			goldEarnedTotal += participant.stats.goldEarned
			killsTotal += participant.stats.kills
			totalWins += participant.stats.win ? 1 : 0
		})

		const goldEarnedAvg = goldEarnedTotal / games.length
		const assistsAvg = assistsTotal / games.length
		const deathsAvg = deathsTotal / games.length
		const killsAvg = killsTotal / games.length
		const kDA = (killsTotal + assistsTotal) / deathsTotal
		const totalLosses = games.length - totalWins

		return {
			assistsAvg,
			assistsTotal,
			deathsAvg,
			deathsTotal,
			gamesCount: games.length,
			goldEarnedAvg,
			goldEarnedTotal,
			kDA,
			killsAvg,
			killsTotal,
			timePlayedAvg,
			timePlayedTotal,
			totalLosses,
			totalWins,
			winPercentage: totalWins / games.length * 100,
		}
	}
}
