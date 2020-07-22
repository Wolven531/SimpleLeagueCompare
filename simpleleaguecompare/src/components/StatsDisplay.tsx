import moment from 'moment'
import React, { FC } from 'react'
import { Game } from '@models/game.model'
import { FORMATTER_NUMBER_FRACTION, FORMATTER_NUMBER_WHOLE } from '../constants'

export interface IStatsDisplay {
	games: Game[]
	targetAccountKey: string
}

const StatsDisplay: FC<IStatsDisplay> = ({ games, targetAccountKey }) => {
	const totalTimePlayed = games.map(g => g.gameDuration).reduce((acc, curr) => acc + curr)
	const avgTimePlayed = totalTimePlayed / games.length
	let totalGoldEarned = 0
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

		totalGoldEarned += participant.stats.goldEarned
		totalWins += participant.stats.win ? 1 : 0
	})

	const avgGoldEarned = totalGoldEarned / games.length

	const displayGamesCount = FORMATTER_NUMBER_WHOLE.format(games.length)
	const displayGoldAvg = FORMATTER_NUMBER_FRACTION.format(avgGoldEarned)
	const displayGoldTotal = FORMATTER_NUMBER_WHOLE.format(totalGoldEarned)
	const displayTimePlayedAvg = FORMATTER_NUMBER_FRACTION.format(moment.duration(avgTimePlayed, 'seconds').asMinutes())
	const displayTimePlayedTotal = FORMATTER_NUMBER_FRACTION.format(moment.duration(totalTimePlayed, 'seconds').asHours())
	const displayTotalLosses = FORMATTER_NUMBER_WHOLE.format(games.length - totalWins)
	const displayTotalWins = FORMATTER_NUMBER_WHOLE.format(totalWins)
	const displayWinPercentage = FORMATTER_NUMBER_FRACTION.format(totalWins / games.length * 100)

	return (
		<div className="stats-display">
			<h3>Games: {displayGamesCount}</h3>
			<h3>Total time played: {displayTimePlayedTotal} hours</h3>
			<h3>Avg. game length: {displayTimePlayedAvg} minutes</h3>
			<h3>Total gold earned: {displayGoldTotal}</h3>
			<h3>Average gold earned per game: {displayGoldAvg}</h3>
			<h3>Wins / Losses: {displayTotalWins} / {displayTotalLosses} ({displayWinPercentage} %)</h3>
		</div>
	)
}

export { StatsDisplay }
