import React, { useEffect, useState } from 'react'
import './App.css'

// const styles = {
// 	devAPIInput: { fontSize: '1.1em', fontWeight: 'bold', padding: 5, textAlign: 'center', width: '420px' }
// }

const API_URL = process.env.REACT_APP_API_URL

const App = () => {
	const ACCT_ENCRYPTED_ANTHONY = 'U9b-KVWyJkTpQR0YiPJt7U8DFqy5llDfTJZYV56-G7onXevEOMC_DiI1'
	const ACCT_ENCRYPTED_NICOLE = 'Cn0MOwyHpDXOLaCqpbkwMoIs1M8r9IJnv39DOM867E1zTjE'
	const ACCT_ENCRYPTED_VINNY = 'aME0ZGruQhV8etyYYIys4vqFarj13QyvFztnwVIHImEgEgiwl7OLPsRE'
	const API_V = '10.8.1'
	const KEY_API_KEY = 'simpleLeagueCompare.API-dev'
	const KEY_CHAMPS = 'simpleLeagueCompare.champs'
	const KEY_CHAMPS_LAST_SAVED = 'simpleLeagueCompare.saved.champs'
	const REGION = 'na1'

	let [champData, setChampData] = useState(null)
	let [devAPIKey, setDevAPIKey] = useState('')
	let [isSpinning, setIsSpinning] = useState(false)
	let [matchlistAnthony, setMatchlistAnthony] = useState([])

	const fetchMatchList = async (encryptedAccountKey: string): Promise<void> => {
		return fetch(`${API_URL}/matchlist/${encryptedAccountKey}/${devAPIKey}`)
			.then(response => response.json())
			.then(matches => {
				// alert(`Received matches\n\nIndices ${startIndex} - ${endIndex}\n\nTotal: ${totalGames}`)
				setMatchlistAnthony(matches)
			})
			.catch(err => {
				alert(`Failed to fetch matches!\n\n${JSON.stringify(err, null, 4)}`)
			})
	}
	const genTimestamp = (): string => String((new Date()).getTime())
	const saveKeyToLocalStorage = () => {
		window.localStorage.setItem(KEY_API_KEY, devAPIKey)
		alert(`Saved!\n\n${devAPIKey}`)
	}
	const toggleSpinMode = () => {
		setIsSpinning(staleSpinning => !staleSpinning)
	}

	useEffect(() => {
		const loadedDevKey = String(window.localStorage.getItem(KEY_API_KEY) || '')

		if (loadedDevKey.length <= 0) {
			alert('No dev API key found in local storage')
		} else {
			setDevAPIKey(loadedDevKey)
		}

		const fetchChamps = async (): Promise<void> => {
			return fetch(`https://ddragon.leagueoflegends.com/cdn/${API_V}/data/en_US/champion.json`)
				.then(resp => resp.json())
				.then(({ data }) => {
					const champMap: any = {}
					const champNames = Object.keys(data)
	
					champNames.forEach(name => {
						const champ = data[name]
						champMap[champ.key] = champ
					})
	
					setChampData(champMap)
					window.localStorage.setItem(KEY_CHAMPS, JSON.stringify(champMap))
					window.localStorage.setItem(KEY_CHAMPS_LAST_SAVED, genTimestamp())
				})
				.catch(err => {
					alert(`Failed to fetch champs!\n\n${JSON.stringify(err, null, 4)}`)
				})
		}
		const loadedLastChamps = String(window.localStorage.getItem(KEY_CHAMPS_LAST_SAVED) || '')

		if (loadedLastChamps.length > 0) {
			const loadedTimestamp = parseInt(loadedLastChamps, 10)
			const lastSetOn = new Date(loadedTimestamp)
			const now = new Date()

			// NOTE:
			// 1. Divide by 1000 to get from ms to sec
			// 2. Divide by 60 to get from sec to min
			// 3. Divide by 1440 to get from min to day
			const diffInDays = (now.getTime() - lastSetOn.getTime()) / 1000 / 60 / 1440

			if (diffInDays >= 1) { // NOTE: saved data is stale, must fetch champs
				fetchChamps()
			}
		} else { // NOTE: never saved data, must fetch champs
			fetchChamps()
		}
	}, [])

	return (
		<div className="app">
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
			<ul>
				<li className={isSpinning ? 'spinning' : ''}>
					Champions:&nbsp;
					<a
						href={`https://ddragon.leagueoflegends.com/cdn/${API_V}/data/en_US/champion.json`}
						rel="noopener noreferrer"
						target="_blank"
					>
						//ddragon.leagueoflegends.com/cdn/{API_V}/data/en_US/champion.json
					</a>
				</li>
				<li>
					Match list for Anthony:&nbsp;
					<a
						href={`https://${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${ACCT_ENCRYPTED_ANTHONY}?api_key=${devAPIKey}`}
						rel="noopener noreferrer"
						target="_blank">Anthony's Matchlist</a>
					<br/>
					<button
						onClick={() => { fetchMatchList(ACCT_ENCRYPTED_ANTHONY) }}
						>Fetch Anthony's Matchlist (beta)</button>
					{matchlistAnthony.length > 0 && <div className="container-matchlist anthony">
						{matchlistAnthony.map(({ champion, gameId, lane, role }) => {
							return (<div className="container-match" key={gameId}>
								<p>Game ID:&nbsp;
									<a
										href={`https://${REGION}.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${devAPIKey}`}
										rel="noopener noreferrer"
										target="_blank">{gameId}</a>
								</p>
								<p>Champion: {champion}</p>
								<p>Lane: {lane}</p>
								<p>Role: {role}</p>
							</div>)
						})}
					</div>}
				</li>
				<li>
					Match list for Nicole:&nbsp;
					<a
						href={`https://${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${ACCT_ENCRYPTED_NICOLE}?api_key=${devAPIKey}`}
						rel="noopener noreferrer"
						target="_blank">Nicole's Matchlist</a>
				</li>
				<li>
					Match list for Vinny:&nbsp;
					<a
						href={`https://${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${ACCT_ENCRYPTED_VINNY}?api_key=${devAPIKey}`}
						rel="noopener noreferrer"
						target="_blank">Vinny's Matchlist</a>
				</li>
			</ul>
			<button onClick={toggleSpinMode}>Toggle Spin Mode!</button>
		</div>
	)
}

export { App }
