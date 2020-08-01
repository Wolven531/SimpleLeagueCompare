import moment from 'moment'
import React, { FC, useEffect, useState } from 'react'
import { CalculatedStats } from '../models/calculated-stats.model'
import { FuncStatsFetch } from '../common-types'
import { FORMATTER_NUMBER_FRACTION, FORMATTER_NUMBER_WHOLE } from '../constants'

export interface IStatsDisplay {
	accountId: string
	apiUrl: string
	fetchStats?: FuncStatsFetch
	numToFetch: number
}

const TOKEN_COMP = 'StatsDisplay'

const DEFAULT_CALC_STATS = new CalculatedStats(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)

const defaultFetchStats: FuncStatsFetch = (
	accountId: string,
	apiUrl: string,
	defaultCalculatedStats = DEFAULT_CALC_STATS,
	numToFetch = 5,
): Promise<CalculatedStats> => {
	const TOKEN_FUNC = `[ fetchStatsDefault | ${TOKEN_COMP} ]`
	const url = `${apiUrl}/stats/summary?accountId=${accountId}&getLastX=${numToFetch}&includeGameData=${String(true)}`

	return fetch(url)
		.then<CalculatedStats>(response => response.json())
		.then(
			calculatedStats => calculatedStats,
			rejectionReason => {
				console.warn(`${TOKEN_FUNC} Fetch stats summary was rejected`, rejectionReason)

				throw rejectionReason
			})
		.catch(err => {
			console.error(`${TOKEN_FUNC} Fetch stats summary failed!`, err)

			return defaultCalculatedStats
		})
}

const StatsDisplay: FC<IStatsDisplay> = ({ accountId, apiUrl, fetchStats = defaultFetchStats, numToFetch }) => {
	const [stats, setStats] = useState(DEFAULT_CALC_STATS)

	useEffect(() => {
		fetchStats(apiUrl, accountId, DEFAULT_CALC_STATS, numToFetch).then(setStats)
	}, [accountId, apiUrl, fetchStats, numToFetch])

	const displayGamesCount = FORMATTER_NUMBER_WHOLE.format(stats.gamesCount)
	const displayGoldAvg = FORMATTER_NUMBER_FRACTION.format(stats.goldEarnedAvg)
	const displayGoldTotal = FORMATTER_NUMBER_WHOLE.format(stats.goldEarnedTotal)
	const displayKDA = FORMATTER_NUMBER_FRACTION.format(stats.kDA)
	const displayTimePlayedAvg = FORMATTER_NUMBER_FRACTION.format(moment.duration(stats.timePlayedAvg, 'seconds').asMinutes())
	const displayTimePlayedTotal = FORMATTER_NUMBER_FRACTION.format(moment.duration(stats.timePlayedTotal, 'seconds').asHours())
	const displayAvgAssists = FORMATTER_NUMBER_FRACTION.format(stats.assistsAvg)
	const displayTotalAssists = FORMATTER_NUMBER_WHOLE.format(stats.assistsTotal)
	const displayAvgDeaths = FORMATTER_NUMBER_FRACTION.format(stats.deathsAvg)
	const displayTotalDeaths = FORMATTER_NUMBER_WHOLE.format(stats.deathsTotal)
	const displayAvgKills = FORMATTER_NUMBER_FRACTION.format(stats.killsAvg)
	const displayTotalKills = FORMATTER_NUMBER_WHOLE.format(stats.killsTotal)
	const displayTotalLosses = FORMATTER_NUMBER_WHOLE.format(stats.totalLosses)
	const displayTotalWins = FORMATTER_NUMBER_WHOLE.format(stats.totalWins)
	const displayWinPercentage = FORMATTER_NUMBER_FRACTION.format(stats.winPercentage)

	return (
		<div className="stats-display">
			<h3>Games: {displayGamesCount}</h3>
			<h3>Avg. game length: {displayTimePlayedAvg} minutes</h3>
			<h3>Avg. gold earned per game: {displayGoldAvg}</h3>
			<h3>Avg. kills per game: {displayAvgKills}</h3>
			<h3>Avg. deaths per game: {displayAvgDeaths}</h3>
			<h3>Avg. assists per game: {displayAvgAssists}</h3>
			<h3>KDA: {displayKDA}</h3>
			<h3>Wins / Losses: {displayTotalWins} / {displayTotalLosses} ({displayWinPercentage} %)</h3>
			<h3>Total time played: {displayTimePlayedTotal} hours</h3>
			<h3>Total gold earned: {displayGoldTotal}</h3>
			<h3>Total kills: {displayTotalKills}</h3>
			<h3>Total deaths: {displayTotalDeaths}</h3>
			<h3>Total assists: {displayTotalAssists}</h3>
		</div>
	)
}

export { StatsDisplay }
