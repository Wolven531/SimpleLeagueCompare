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
	})

	const avgGoldEarned = totalGoldEarned / games.length

	const displayGoldAvg = FORMATTER_NUMBER_FRACTION.format(avgGoldEarned)
	const displayGoldTotal = FORMATTER_NUMBER_WHOLE.format(totalGoldEarned)
	const displayTimePlayedAvg = FORMATTER_NUMBER_FRACTION.format(moment.duration(avgTimePlayed, 'seconds').asMinutes())
	const displayTimePlayedTotal = FORMATTER_NUMBER_FRACTION.format(moment.duration(totalTimePlayed, 'seconds').asHours())

	return (
		<div className="stats-display">
			<h3>Games: {games.length}</h3>
			<h3>Total time played: {displayTimePlayedTotal} hours</h3>
			<h3>Avg. game length: {displayTimePlayedAvg} minutes</h3>
			<h3>Total gold earned: {displayGoldTotal}</h3>
			<h3>Average gold earned per game: {displayGoldAvg}</h3>
		</div>
	)
}

export { StatsDisplay }
