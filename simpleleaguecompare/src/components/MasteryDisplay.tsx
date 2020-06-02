import React, { FC, useState, useEffect } from 'react'

export type FuncMasterySet = (newMastery: number) => void
export type FuncMasteryFetch = (apiUrl: string, summonerId: string, setMastery: FuncMasterySet) => Promise<void>

export interface IMasteryDisplay {
	apiUrl: string
	fetchMastery?: FuncMasteryFetch
	playerName: string
	summonerId: string
}

const fetchMasteryDefault = async (
	apiUrl: string,
	summonerId: string,
	setMastery: FuncMasterySet,
): Promise<void> => {
	return fetch(`${apiUrl}/matchlist/mastery/${summonerId}`)
		.then(response => response.json())
		.then(totalMastery => {
			setMastery(totalMastery)
		})
		.catch(err => {
			alert(`Failed to fetch mastery!\n\n${JSON.stringify(err, null, 4)}`)
		})
}

const MasteryDisplay: FC<IMasteryDisplay> = ({
	apiUrl,
	fetchMastery = fetchMasteryDefault,
	playerName,
	summonerId }
) => {
	const [mastery, setMastery] = useState(-1)

	useEffect(() => {
		fetchMastery(apiUrl, summonerId, setMastery)
	}, [apiUrl, fetchMastery, playerName, summonerId])

	return (
		<div className="mastery-container">
			<p>{playerName}'s mastery: <b>{mastery}</b></p>
		</div>
	)
}

export { MasteryDisplay }
