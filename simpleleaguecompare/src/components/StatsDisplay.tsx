import moment from 'moment'
import React, { FC } from 'react'
import { Game } from '@models/game.model'

export interface IStatsDisplay {
	games: Game[]
}

const StatsDisplay: FC<IStatsDisplay> = ({ games }) => {
	const totalTimePlayed = games.map(g => g.gameDuration).reduce((acc, curr) => acc + curr)
	const avgTimePlayed = totalTimePlayed / games.length

	return (
		<div className="stats-display">
			<h3>Games: {games.length}</h3>
			<h3>Total time played: {moment.duration(totalTimePlayed, "seconds").asHours().toFixed(2)} hours</h3>
			<h3>Avg. game length: {moment.duration(avgTimePlayed, "seconds").asMinutes().toFixed(2)} minutes</h3>
			<h3>Participants</h3>
			<ol>
				<li>
					<h4>Team 1</h4>
					<ol>
						<li></li>
					</ol>
				</li>
				<li>
					<h4>Team 2</h4>
					<ol>
						<li></li>
					</ol>
				</li>
			</ol>
		</div>
	)
}

export { StatsDisplay }
