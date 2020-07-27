import { Injectable } from '@nestjs/common'
import { CalculatedStats } from '@models/calculated-stats.model'
import { Game } from '@models/game.model'

@Injectable()
export class StatsService {
	calculateGeneralStats(targetAccountKey: string, games: Game[]): CalculatedStats {
		const totalTimePlayed = games.map(g => g.gameDuration).reduce((acc, curr) => acc + curr)
		const avgTimePlayed = totalTimePlayed / games.length

		let totalAssists = 0
		let totalDeaths = 0
		let totalGoldEarned = 0
		let totalKills = 0
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

			totalAssists += participant.stats.assists
			totalDeaths += participant.stats.deaths
			totalGoldEarned += participant.stats.goldEarned
			totalKills += participant.stats.kills
			totalWins += participant.stats.win ? 1 : 0
		})

		const avgGoldEarned = totalGoldEarned / games.length
		const avgKDA = (totalKills + totalAssists) / totalDeaths
		const totalLosses = games.length - totalWins

		return {
			gamesCount: games.length,
			goldAvg: avgGoldEarned,
			goldTotal: totalGoldEarned,
			kDA: avgKDA,
			timePlayedAvg: avgTimePlayed,
			timePlayedTotal: totalTimePlayed,
			totalAssists,
			totalDeaths,
			totalKills,
			totalLosses,
			totalWins,
			winPercentage: totalWins / games.length * 100,
		}
	}
}
