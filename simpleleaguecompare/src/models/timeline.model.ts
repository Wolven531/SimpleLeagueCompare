class Timeline {
	/**
	 * @param participantId - In-game identifier of the player to which this timeline pertains
	 * @param creepsPerMinDeltas - ???
	 * @param xpPerMinDeltas - ???
	 * @param goldPerMinDeltas - ???
	 * @param csDiffPerMinDeltas - ???
	 * @param xpDiffPerMinDeltas - ???
	 * @param damageTakenPerMinDeltas - ???
	 * @param damageTakenDiffPerMinDeltas - ???
	 * @param role - Calculated role for the player in-game
	 * @param lane - Calculated lane for the player in-game
	 */
	constructor(
		public participantId: number,
		public creepsPerMinDeltas: any,
		public xpPerMinDeltas: any,
		public goldPerMinDeltas: any,
		public csDiffPerMinDeltas: any,
		public xpDiffPerMinDeltas: any,
		public damageTakenPerMinDeltas: any,
		public damageTakenDiffPerMinDeltas: any,
		public role: string,
		public lane: string,

	) {}
}

export { Timeline }
