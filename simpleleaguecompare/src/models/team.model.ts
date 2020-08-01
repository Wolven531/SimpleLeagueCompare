class Team {
	/**
	 * @param teamId - Team number used in game (i.e. 100, 200)
	 * @param win - Whether the team achieved a victory (e.g. 'Win')
	 * @param firstBlood - True if this team scored the first kill in the game, false otherwise
	 * @param firstTower - True if this team destroyed the first tower in the game, false otherwise
	 * @param firstInhibitor - True if this team destroyed the first inhibitor in the game, false otherwise
	 * @param firstBaron - True if this team scored the first baron monster kill in the game, false otherwise
	 * @param firstDragon - True if this team scored the first dragon monster kill in the game, false otherwise
	 * @param firstRiftHerald - True if this team scored the first rift herald monster kill in the game, false otherwise
	 * @param towerKills - Number of towers this team destroyed in the game
	 * @param inhibitorKills - Number of inhibitors this team destroyed in the game
	 * @param baronKills - Number of baron monster kills this team scored in the game
	 * @param dragonKills - Number of dragon monster kills this team scored in the game
	 * @param vilemawKills - Number of vile maw monster kills this team scored in the game
	 * @param riftHeraldKills - Number of rift herald monster kills this team scored in the game
	 * @param dominionVictoryScore - Score achieved if the game was dominion
	 * @param bans - array of champions banned from the game in pre-game setup
	 */
	constructor(
		public teamId: number,
		public win: string,
		public firstBlood: boolean,
		public firstTower: boolean,
		public firstInhibitor: boolean,
		public firstBaron: boolean,
		public firstDragon: boolean,
		public firstRiftHerald: boolean,
		public towerKills: number,
		public inhibitorKills: number,
		public baronKills: number,
		public dragonKills: number,
		public vilemawKills: number,
		public riftHeraldKills: number,
		public dominionVictoryScore: number,
		public bans: any[],
	) {}
}

export { Team }
