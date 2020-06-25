class User {
	/**
	 * @param accountId - Encrypted account ID for the user
	 * @param lastUpdated - Timestamp of the last update run time for the user
	 * @param masteryTotal - Total mastery points the user has earned
	 * @param name - Friendly name of the user
	 * @param summonerId - Simple summoner ID for the user
	 */
	constructor(
		public accountId: string,
		public lastUpdated: number,
		public totalMastery: number,
		public name: string,
		public summonerId: string,
	) {}
}

export { User }
