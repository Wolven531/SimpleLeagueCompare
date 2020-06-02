import React, { FC, useEffect, useState } from 'react'

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
): Promise<number> => {
	return fetch(`${apiUrl}/matchlist/mastery/${summonerId}`)
		.then(response => response.json())
		.then((totalMasteryString: string) => {
			let numTotalMastery: number

			try {
				numTotalMastery = parseInt(totalMasteryString, 10)
				setMastery(numTotalMastery)

				return numTotalMastery
			} catch (e) {
				throw e
			}
		},
		rejectionReason => {
			console.warn(`[ fetchMasteryDefault | MasteryDisplay ] Fetch total mastery was rejected`, rejectionReason)

			throw rejectionReason
		})
		.catch(err => {
			console.error(`[ fetchMasteryDefault | MasteryDisplay ] Fetch total mastery was rejected`, err)

			return -1
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
