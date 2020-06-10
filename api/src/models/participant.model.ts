class Participant {
	/**
	 * @param participantId - Number of user the user in game (i.e. 1 - 10)
	 * @param teamId - Number representing the in game team for the user (e.g. 100, 200)
	 * @param championId - ID of the champion the user played in game
	 * @param spell1Id - ID of the first spell the user selected in loadout before game
	 * @param spell2Id - ID of the second spell the user selected in loadout before game
	 * @param stats - An object containing stats about the user's performance in game
	 * @param timeline - An object containing stats about the user's delta values throughout the game
	 */
	constructor(
		public participantId: number,
		public teamId: number,
		public championId: number,
		public spell1Id: number,
		public spell2Id: number,
		public stats: any,
		public timeline: any,
	) {}
}

export { Participant }
