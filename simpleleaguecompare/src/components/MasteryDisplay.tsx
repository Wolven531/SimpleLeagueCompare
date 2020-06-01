import React, { FC, useState, useEffect } from 'react'

export interface IMasteryDisplay {
	apiUrl: string
	playerName: string
	summonerId: string
}

const MasteryDisplay: FC<IMasteryDisplay> = ({ apiUrl, playerName, summonerId }) => {
	const [mastery, setMastery] = useState(-1)

	const fetchMastery = async (summonerId: string): Promise<void> => {
		return fetch(`${apiUrl}/matchlist/mastery/${summonerId}`)
			.then(response => response.json())
			.then(totalMastery => {
				setMastery(totalMastery)
			})
			.catch(err => {
				alert(`Failed to fetch mastery!\n\n${JSON.stringify(err, null, 4)}`)
			})
	}

	useEffect(() => {
		fetchMastery(summonerId)
	}, [apiUrl, playerName, summonerId])

	return (
		<div className="mastery-container">
			<p>{playerName}'s mastery: <b>{mastery}</b></p>
		</div>
	)
}

export { MasteryDisplay }
