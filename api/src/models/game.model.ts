import { Participant } from './participant.model'

class Game {
	/**
	 * @param gameCreation - Timestamp of when game was created
	 * @param gameDuration - Length of game in seconds
	 * @param gameId - Unique identifier for game
	 * @param gameMode - Mode of game (e.g. "CLASSIC")
	 * @param gameType - Type of game (e.g. "MATCHED_GAME")
	 * @param gameVersion - Patch version used for game
	 * @param mapId - Refers to which map game was played on
	 * @param participantIdentities - Array of info related to League about participants
	 * @param participants - Array of info related to specific game about participants
	 * @param platformId - Which platform game was played on (e.g. "NA1")
	 * @param queueId - Which queue generated game
	 * @param seasonId - Which season game was played in
	 * @param teams - Array describing the factions in game
	 */
	constructor(
		public gameCreation: number,
		public gameDuration: number,
		public gameId: number,
		public gameMode: string,
		public gameType: string,
		public gameVersion: string,
		public mapId: number,
		public participantIdentities: any[],
		public participants: Participant[],
		public platformId: string,
		public queueId: number,
		public seasonId: number,
		public teams: any[],
	) {}
}

export { Game }
