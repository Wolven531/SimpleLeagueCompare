class User {
	/**
	 * @param accountId - Encrypted account ID for the user
	 * @param lastUpdated - UTC Timestamp of the last update run time for the user
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

	/**
	 * @returns True if user model has been updated within the last day; false otherwise
	 */
	get isFresh(): boolean {
		const now = new Date()
		const nowUtc = Date.UTC(now.getFullYear(), now.getMonth())
		const diff = nowUtc - this.lastUpdated

		// NOTE: if diff in time is less than or equal to 24 hours (i.e. one day)
		return diff <= (1000 * 60 * 60 * 24)
	}
}

export { User }
