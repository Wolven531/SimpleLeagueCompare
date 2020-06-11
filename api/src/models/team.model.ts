class Team {
	/**
	 *
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
