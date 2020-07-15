import { Player } from '@models/player.model'

class ParticipantIdentity {
	/**
	 * @param participantId - Number of the participant in game (e.g. 1-10 on SR, 1-9 on TFT)
	 * @param player - Object containing player information for this participant
	 */
	constructor(
		public participantId: number,
		public player: Player,
	) {}
}

export { ParticipantIdentity }
