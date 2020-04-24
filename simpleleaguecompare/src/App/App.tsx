import React, { useEffect, useState } from 'react'
import './App.css'

// const styles = {
// 	devAPIInput: { fontSize: '1.1em', fontWeight: 'bold', padding: 5, textAlign: 'center', width: '420px' }
// }

const App = () => {
	const ACCT_ENCRYPTED_ANTHONY = 'U9b-KVWyJkTpQR0YiPJt7U8DFqy5llDfTJZYV56-G7onXevEOMC_DiI1'
	const ACCT_ENCRYPTED_NICOLE = 'Cn0MOwyHpDXOLaCqpbkwMoIs1M8r9IJnv39DOM867E1zTjE'
	const ACCT_ENCRYPTED_VINNY = 'aME0ZGruQhV8etyYYIys4vqFarj13QyvFztnwVIHImEgEgiwl7OLPsRE'
	const API_V = '10.8.1'
	const REGION = 'na1'

	let [devAPIKey, setDevAPIKey] = useState('')
	let [isSpinning, setIsSpinning] = useState(false)

	const saveKeyToLocalStorage = () => {
		window.localStorage.setItem('simpleLeagueCompare.API-dev', devAPIKey)
		alert(`Saved!\n\n${devAPIKey}`)
	}
	const toggleSpinMode = () => {
		setIsSpinning(staleSpinning => !staleSpinning)
	}

	useEffect(() => {
		console.log('app loaded, setting dev key from local storage...')
		const loadedDevKey = String(window.localStorage.getItem('simpleLeagueCompare.API-dev'))

		if (loadedDevKey.length <= 0) {
			alert('No dev API key found in local storage')
			return
		}

		setDevAPIKey(loadedDevKey)
	}, [])

	return (
		<div className="app">
			<ol>
				<li>
					Generate new development key (once per day)&nbsp;
					<a
						href="//developer.riotgames.com/"
						rel="noopener noreferrer"
						target="_blank"
					>
						here
					</a>
				</li>
				<li>Enter key&nbsp;
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
						href={`//ddragon.leagueoflegends.com/cdn/${API_V}/data/en_US/champion.json`}
						rel="noopener noreferrer"
						target="_blank"
					>
						//ddragon.leagueoflegends.com/cdn/{API_V}/data/en_US/champion.json
					</a>
				</li>
				<li>
					Match list for Anthony:&nbsp;
					<a
						href={`//${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${ACCT_ENCRYPTED_ANTHONY}`}
						rel="noopener noreferrer"
						target="_blank">Anthony's Matchlist</a>
				</li>
				<li>
					Match list for Nicole:&nbsp;
					<a
						href={`//${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${ACCT_ENCRYPTED_NICOLE}`}
						rel="noopener noreferrer"
						target="_blank">Nicole's Matchlist</a>
				</li>
				<li>
					Match list for Vinny:&nbsp;
					<a
						href={`//${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${ACCT_ENCRYPTED_VINNY}`}
						rel="noopener noreferrer"
						target="_blank">Vinny's Matchlist</a>
				</li>
			</ul>
			<button onClick={toggleSpinMode}>Toggle Spin Mode!</button>
		</div>
	)
}

export { App }
