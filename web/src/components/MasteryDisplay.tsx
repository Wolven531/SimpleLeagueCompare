import React, { FC, useEffect, useState } from 'react'
import { FuncMasteryFetch } from '../common-types'
import {
	DEFAULT_TOTAL_MASTERY,
	DEFAULT_TOTAL_MASTERY_DISPLAY
} from '../constants'

export interface IMasteryDisplay {
	apiUrl: string
	fetchMastery?: FuncMasteryFetch
	playerName: string
	summonerId: string
}

const TOKEN_COMP = 'MasteryDisplay'

const defaultFetchMastery: FuncMasteryFetch = (
	apiUrl: string,
	summonerId: string,
	defaultTotalMastery = DEFAULT_TOTAL_MASTERY,
): Promise<number> => {
	const TOKEN_FUNC = `[ fetchMasteryDefault | ${TOKEN_COMP} ]`
	const url = `${apiUrl}/mastery/total/${summonerId}`

	return fetch(url)
		.then(response => response.json())
		.then((totalMasteryString: string) => {
			let numTotalMastery = parseInt(totalMasteryString, 10)

			if (isNaN(numTotalMastery)) {
				console.warn(
					`${TOKEN_FUNC} Unable to parse total mastery...`,
					JSON.stringify(totalMasteryString, null, 4))
				numTotalMastery = defaultTotalMastery
			}

			return numTotalMastery
		},
		rejectionReason => {
			console.warn(`${TOKEN_FUNC} Fetch total mastery was rejected`, rejectionReason)

			throw rejectionReason
		})
		.catch(err => {
			console.error(`${TOKEN_FUNC} Fetch total mastery failed!`, err)

			return defaultTotalMastery
		})
}

const MasteryDisplay: FC<IMasteryDisplay> = ({
	apiUrl,
	fetchMastery = defaultFetchMastery,
	playerName,
	summonerId,
}) => {
	const [mastery, setMastery] = useState(DEFAULT_TOTAL_MASTERY)

	useEffect(() => {
		fetchMastery(apiUrl, summonerId).then(setMastery)
	}, [apiUrl, fetchMastery, playerName, summonerId])

	const masteryDisplay = mastery === DEFAULT_TOTAL_MASTERY ? DEFAULT_TOTAL_MASTERY_DISPLAY : mastery

	return (
		<div className="mastery-container">
			<p>
				{playerName}'s mastery: <b>{masteryDisplay}</b>
			</p>
		</div>
	)
}

export { MasteryDisplay }
