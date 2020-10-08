class Player {
	/**
	 * @param platformId - Original region player exists in (e.g. 'NA')
	 * @param accountId - Original encrypted account ID for player
	 * @param summonerName - Name displayed for player in game
	 * @param summonerId - Simple unique summoner ID for player
	 * @param currentPlatformId - Current region player exists in (equal to `platformId` in most cases)
	 * @param currentAccountId - Current encrypted account ID for player (equal to `accountId` in most cases)
	 * @param matchHistoryUri - Unique URI used to retrieve the match history for player
	 * @param profileIcon - Unique identifier for the icon selected by player
	 */
	constructor(
		public platformId: string,
		public accountId: string,
		public summonerName: string,
		public summonerId: string,
		public currentPlatformId: string,
		public currentAccountId: string,
		public matchHistoryUri: string,
		public profileIcon: number,
	) {}
}

export { Player }
