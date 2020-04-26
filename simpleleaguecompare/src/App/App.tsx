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

	const fetchMatchList = async (encryptedAccountKey: string) => {
		// const headers: Headers = new Headers()
		// headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36')
		// headers.set('Accept-Language', 'en-US,en;q=0.9')
		// headers.set('Accept-Charset', 'application/x-www-form-urlencoded; charset=UTF-8')
		// headers.set('X-Riot-Token', 'devAPIKey)

		// NOTE: using token in headers appears to be broken due to pre-flight OPTIONS request in Chrome
		await fetch(`https://${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountKey}?api_key=${devAPIKey}`, {
		// await fetch(`https://${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${encryptedAccountKey}`, {
			// cache: 'no-cache', // no-cache, reload, force-cache, only-if-cached
			// credentials: 'same-origin', // include, same-origin, omit
			// headers: {
				// 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36',
				// 'Accept-Language': 'en-US,en;q=0.9',
				// 'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
				// NOTE: cannot use custom header (to keep request simple enough for CORS)
				// 	'X-Riot-Token': devAPIKey
			// },
			// method: 'get',
			// mode: 'cors', // 'no-cors'
			// redirect: 'follow', // manual, *follow, error
			// referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		})
			.then(response => response.json())
			.then(matchJson => {
				console.log(`Received match JSON\n\n${JSON.stringify(matchJson, null, 4)}`)
			})
			.catch(err => {
				alert(`Failed to fetch!\n\n${JSON.stringify(err, null, 4)}`)
			})
	}
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
						href={`https://${REGION}.api.riotgames.com/lol/match/v4/matchlists/by-account/${ACCT_ENCRYPTED_ANTHONY}?api_key=${devAPIKey}`}
						rel="noopener noreferrer"
						target="_blank">Anthony's Matchlist</a>
					<button
						onClick={() => { fetchMatchList(ACCT_ENCRYPTED_ANTHONY) }}
						>Fetch Anthony's Matchlist (beta)</button>
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
