import React, { FC, useState } from 'react'

export interface IMasteryDisplay {
	apiKey: string
	apiUrl: string
	playerName: string
	summonerId: string
}

const MasteryDisplay: FC<IMasteryDisplay> = ({ apiKey, apiUrl, playerName, summonerId }) => {
	const [mastery, setMastery] = useState(-1)

	const fetchMastery = async (summonerId: string): Promise<void> => {
		// return fetch(`${apiUrl}/matchlist/${encryptedAccountKey}?getLastX=${numToFetch}`)
		// 	.then(response => response.json())
		// 	.then(totalMastery => {
		// 		setMastery(totalMastery)
		// 	})
		// 	.catch(err => {
		// 		alert(`Failed to fetch mastery!\n\n${JSON.stringify(err, null, 4)}`)
		// 	})
	}

	return (
		<div className="mastery-container">
			<p>Mastery for {playerName}:</p>
			<button onClick={() => { fetchMastery(summonerId) }}>Fetch {playerName}'s Mastery</button>
			{mastery}
		</div>
	)
}

export { MasteryDisplay }
