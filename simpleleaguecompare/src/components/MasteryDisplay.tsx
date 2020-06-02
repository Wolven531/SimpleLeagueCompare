import React, { FC, useEffect, useState } from 'react'

export type FuncMasterySet = (newMastery: number) => void
export type FuncMasteryFetch = (apiUrl: string, summonerId: string, setMastery: FuncMasterySet) => Promise<void>

export interface IMasteryDisplay {
	apiUrl: string
	fetchMastery?: FuncMasteryFetch
	playerName: string
	summonerId: string
}

const TOKEN_COMP = 'MasteryDisplay'

const fetchMasteryDefault = async (
	apiUrl: string,
	summonerId: string,
	setMastery: FuncMasterySet,
): Promise<number> => {
	const TOKEN_FUNC = 'fetchMasteryDefault'
	const url = `${apiUrl}/matchlist/mastery/${summonerId}`

	return fetch(url)
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
			console.warn(`[ ${TOKEN_FUNC} | ${TOKEN_COMP} ] Fetch total mastery was rejected`, rejectionReason)

			throw rejectionReason
		})
		.catch(err => {
			console.error(`[ ${TOKEN_FUNC} | ${TOKEN_COMP} ] Fetch total mastery failed!`, err)

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
