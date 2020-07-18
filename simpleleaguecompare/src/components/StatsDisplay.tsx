import React, { FC } from 'react'
import { Game } from '@models/game.model'

export interface IStatsDisplay {
	games: Game[]
}

const StatsDisplay: FC<IStatsDisplay> = ({ games }) => {
	const totalTimePlayed = games.map(g => g.gameDuration).reduce((acc, curr) => acc + curr)

	return (
		<div className="stats-display">
			<h3>Games: {games.length}</h3>
			<h3>Total time played: {totalTimePlayed} seconds</h3>
		</div>
	)
}

export { StatsDisplay }
