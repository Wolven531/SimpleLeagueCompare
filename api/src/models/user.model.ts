class User {
	/**
	 * @param accountId - Encrypted account ID for the user
	 * @param name - Friendly name of the user
	 * @param summonerId - Simple summoner ID for the user
	 */
	constructor(
		public accountId: string,
		public name: string,
		public summonerId: string,
	) {}
}

export { User }
