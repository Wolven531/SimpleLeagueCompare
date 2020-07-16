import React, { FC } from 'react'
import { Game } from '@models/game.model'

export interface IStatsDisplay {
	games: Game[]
}

const StatsDisplay: FC<IStatsDisplay> = ({ games }) => {
	return (
		<div className="stats-display">
		</div>
	)
}

export { StatsDisplay }
