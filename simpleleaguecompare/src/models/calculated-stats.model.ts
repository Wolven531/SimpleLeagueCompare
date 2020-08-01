class CalculatedStats {
	/**
	 * @param gamesCount - number of games used to calculate the stats in this instance
	 * @param goldEarnedAvg - average amount of gold earned per game
	 * @param goldEarnedTotal - total amount of gold earned across all games
	 * @param kDA - calculated by adding kills and assists and dividing by assists across all games
	 * @param timePlayedAvg - average amount of seconds per game
	 * @param timePlayedTotal - total amount of seconds across all games
	 * @param assistsAvg - average amount of assists earned per game
	 * @param assistsTotal - total amount of assists earned across all games
	 * @param deathsAvg - average amount of deaths earned per game
	 * @param deathsTotal - total amount of deaths earned across all games
	 * @param killsAvg - average amount of kills earned per game
	 * @param killsTotal - total amount of kills earned across all games
	 * @param totalLosses - total number of losses across all games
	 * @param totalWins - total number of wins across all games
	 * @param winPercentage - ratio of wins to total number games
	 */
	constructor(
		public gamesCount: number,
		public goldEarnedAvg: number,
		public goldEarnedTotal: number,
		public kDA: number,
		public timePlayedAvg: number,
		public timePlayedTotal: number,
		public assistsAvg: number,
		public assistsTotal: number,
		public deathsAvg: number,
		public deathsTotal: number,
		public killsAvg: number,
		public killsTotal: number,
		public totalLosses: number,
		public totalWins: number,
		public winPercentage: number,
	) {}
}

export { CalculatedStats }
