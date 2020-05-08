import React, { FC, useEffect, useState } from 'react'
import {
	API_URL,
	fetchChamps,
	KEY_API_KEY,
	KEY_CHAMPS_LAST_SAVED
} from '../utils'

export interface IAPIConfigInfoProps {
	onAPIKeySaved: (newKey: string) => void
}

const APIConfigInfo: FC<IAPIConfigInfoProps> = ({ onAPIKeySaved }) => {
	const [champData, setChampData] = useState(null)
	const [devAPIKey, setDevAPIKey] = useState('')

	const saveKeyToLocalStorage = () => {
		window.localStorage.setItem(KEY_API_KEY, devAPIKey)
		onAPIKeySaved(devAPIKey)
		alert(`Saved!\n\n${devAPIKey}`)
	}

	useEffect(() => {
		const loadedDevKey = String(window.localStorage.getItem(KEY_API_KEY) || '')

		if (loadedDevKey.length <= 0) {
			console.warn('No dev API key found in local storage')
		} else {
			setDevAPIKey(loadedDevKey)
			onAPIKeySaved(loadedDevKey)
		}

		const loadedLastChamps = String(window.localStorage.getItem(KEY_CHAMPS_LAST_SAVED) || '')
		const areLastChampsAvailable = loadedLastChamps.length > 0

		if (areLastChampsAvailable) {
			const loadedTimestamp = parseInt(loadedLastChamps, 10)
			const lastSetOn = new Date(loadedTimestamp)
			const now = new Date()

			// NOTE:
			// 1. Divide by 1000 to get from ms to sec
			// 2. Divide by 60 to get from sec to min
			// 3. Divide by 1440 to get from min to day
			const diffInDays = (now.getTime() - lastSetOn.getTime()) / 1000 / 60 / 1440

			if (diffInDays >= 1) { // NOTE: saved data is stale, must fetch champs
				fetchChamps().then(champMap => { setChampData(champMap) })
			}
		} else { // NOTE: never saved data, must fetch champs
			fetchChamps().then(champMap => { setChampData(champMap) })
		}
	}, [onAPIKeySaved])

	return (
		<ol>
			<li>
				Local API is at&nbsp;
				<a
					href={API_URL}
					rel="noopener noreferrer"
					target="_blank"
				>{API_URL}</a>
			</li>
			<li>
				<a
					href="//developer.riotgames.com/"
					rel="noopener noreferrer"
					target="_blank"
				>Generate new development key</a> (once per day)
			</li>
			<li>
				Enter key&nbsp;
				<input
					onChange={(evt) => { setDevAPIKey(evt.target.value) }}
					placeholder="Enter dev API key"
					style={{
						fontSize: '1.1em',
						fontWeight: 'bold',
						padding: 5,
						textAlign: 'center',
						width: '420px'
					}}
					value={devAPIKey} />&nbsp;
				<button
					onClick={saveKeyToLocalStorage}
					>Save Key (localStorage)</button>
			</li>
		</ol>
	)
}

export { APIConfigInfo }
