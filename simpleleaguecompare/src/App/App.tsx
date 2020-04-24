import React, { useEffect, useState } from 'react'
import './App.css'

// const styles = {
// 	devAPIInput: { fontSize: '1.1em', fontWeight: 'bold', padding: 5, textAlign: 'center', width: '420px' }
// }

const App = () => {
	const API_V = '10.8.1'

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
			</ul>
			<button onClick={toggleSpinMode}>Toggle Spin Mode!</button>
		</div>
	)
}

export { App }
