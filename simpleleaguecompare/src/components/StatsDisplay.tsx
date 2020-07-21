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
		g.participantIdentities.forEach(p => {
			if (p.player.currentAccountId !== targetAccountKey) {
				return
			}

			const participant = g.participants.find(par => par.participantId === p.participantId)

			if (!participant) {
				return
			}

			totalGoldEarned += participant.stats.goldEarned
		})
	})

	const avgGoldEarned = totalGoldEarned / games.length

	return (
		<div className="stats-display">
			<h3>Games: {games.length}</h3>
			<h3>Total time played: {moment.duration(totalTimePlayed, "seconds").asHours().toFixed(2)} hours</h3>
			<h3>Avg. game length: {moment.duration(avgTimePlayed, "seconds").asMinutes().toFixed(2)} minutes</h3>
			<h3>Total gold earned: {FORMATTER_NUMBER_WHOLE.format(totalGoldEarned)}</h3>
			<h3>Average gold earned per game: {FORMATTER_NUMBER_FRACTION.format(avgGoldEarned)}</h3>
		</div>
	)
}

export { StatsDisplay }
