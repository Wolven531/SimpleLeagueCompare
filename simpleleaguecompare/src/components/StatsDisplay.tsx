import moment from 'moment'
import React, { FC } from 'react'
import { Game } from '@models/game.model'

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

	return (
		<div className="stats-display">
			<h3>Games: {games.length}</h3>
			<h3>Total time played: {moment.duration(totalTimePlayed, "seconds").asHours().toFixed(2)} hours</h3>
			<h3>Avg. game length: {moment.duration(avgTimePlayed, "seconds").asMinutes().toFixed(2)} minutes</h3>
			<h3>Total gold earned: {totalGoldEarned}</h3>
		</div>
	)
}

export { StatsDisplay }
