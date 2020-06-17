class Match {
	/**
	 * @param gameId - Uniue ID for the game played
	 * @param role - Calculated value of the role played in game (e.g. "NONE", "DUO_SUPPORT", "DUO")
	 * @param season - Season of League the game was played in
	 * @param platformId - Region the game was playe in (e.g. "NA1")
	 * @param champion - ID of the champ played in game
	 * @param queue - Which queue the game was launched from
	 * @param lane - Calculated value of the lane played in game (e.g. "NONE, "BOTTOM, "JUNGLE")
	 * @param timestamp - Timestamp of when the game began
	 */
	constructor(
		public gameId: number,
		public role: string,
		public season: number,
		public platformId: string,
		public champion: number,
		public queue: number,
		public lane: string,
		public timestamp: number,
	) {}
}

export { Match }
