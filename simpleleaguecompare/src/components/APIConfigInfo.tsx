import React, { FC, useEffect, useState } from 'react'

const API_URL = process.env.REACT_APP_API_URL

export interface IAPIConfigInfoProps {
	onAPIKeySaved: (newKey: string) => void
}

const fetchChamps = async (): Promise<any> => {
	const API_V = '10.8.1'
	const KEY_CHAMPS = 'simpleLeagueCompare.champs'
	const KEY_CHAMPS_LAST_SAVED = 'simpleLeagueCompare.saved.champs'
	const genTimestamp = (): string => String((new Date()).getTime())

	return fetch(`https://ddragon.leagueoflegends.com/cdn/${API_V}/data/en_US/champion.json`)
		.then(resp => resp.json())
		.then(({ data }) => {
			const champMap: any = {}
			const champNames = Object.keys(data)

			champNames.forEach(name => {
				const champ = data[name]
				champMap[champ.key] = champ
			})

			window.localStorage.setItem(KEY_CHAMPS, JSON.stringify(champMap))
			window.localStorage.setItem(KEY_CHAMPS_LAST_SAVED, genTimestamp())

			return champMap
		})
		.catch(err => {
			alert(`Failed to fetch champs!\n\n${JSON.stringify(err, null, 4)}`)
		})
}

const APIConfigInfo: FC<IAPIConfigInfoProps> = ({ onAPIKeySaved }) => {
	const KEY_API_KEY = 'simpleLeagueCompare.API-dev'
	const KEY_CHAMPS_LAST_SAVED = 'simpleLeagueCompare.saved.champs'

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
			alert('No dev API key found in local storage')
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
