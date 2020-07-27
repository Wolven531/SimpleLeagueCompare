class CalculatedStats {
	/**
	 * @param gamesCount - number of games used to calculate the stats in this instance
	 * @param goldAvg - average amount of gold earned per game
	 * @param goldTotal - total amount of gold earned across all games
	 * @param kDA - calculated by adding kills and assists and dividing by assists across all games
	 * @param timePlayedAvg - average amount of seconds per game
	 * @param timePlayedTotal - total amount of seconds across all games
	 * @param totalAssists - total amount of assists earned across all games
	 * @param totalDeaths - total amount of deaths earned across all games
	 * @param totalKills - total amount of kills earned across all games
	 * @param totalLosses - total number of losses across all games
	 * @param totalWins - total number of wins across all games
	 * @param winPercentage - ratio of wins to total number games
	 */
	constructor(
		public gamesCount: number,
		public goldAvg: number,
		public goldTotal: number,
		public kDA: number,
		public timePlayedAvg: number,
		public timePlayedTotal: number,
		public totalAssists: number,
		public totalDeaths: number,
		public totalKills: number,
		public totalLosses: number,
		public totalWins: number,
		public winPercentage: number,
	) {}
}

export { CalculatedStats }
