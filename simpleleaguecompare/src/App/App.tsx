import React, { useState } from 'react'
import { APIConfigInfo } from '../components/APIConfigInfo'
import { KEY_CHAMPS } from '../utils'
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
	const REGION = 'na1'

	const [champData, setChampData] = useState<any>(JSON.parse(window.localStorage.getItem(KEY_CHAMPS) || '{}'))
	const [devAPIKey, setDevAPIKey] = useState('')
	const [isSpinning, setIsSpinning] = useState(false)
	const [matchlistAnthony, setMatchlistAnthony] = useState<any[]>([])
	const [matchlistNicole, setMatchlistNicole] = useState<any[]>([])
	const [matchlistVinny, setMatchlistVinny] = useState<any[]>([])

	const fetchMatchList = async (encryptedAccountKey: string): Promise<void> => {
		return fetch(`${API_URL}/matchlist/${encryptedAccountKey}/${devAPIKey}`)
			.then(response => response.json())
			.then(matches => {
				switch (encryptedAccountKey) {
					case ACCT_ENCRYPTED_ANTHONY:
						setMatchlistAnthony(matches)
					break
					case ACCT_ENCRYPTED_NICOLE:
						setMatchlistNicole(matches)
					break
					case ACCT_ENCRYPTED_VINNY:
						setMatchlistVinny(matches)
					break
					default:
						console.warn(`Unknown account key: key="${encryptedAccountKey}"`)
					break
				}
				
			})
			.catch(err => {
				alert(`Failed to fetch matches!\n\n${JSON.stringify(err, null, 4)}`)
			})
	}
	const toggleSpinMode = () => {
		setIsSpinning(staleSpinning => !staleSpinning)
	}
	const updateApiKey = (newApiKey: string) => { setDevAPIKey(newApiKey) }
	const updateChampsSaved = (newChampMap: any) => {
		if (champData !== newChampMap) {
			setChampData(newChampMap)
		}
	}

	return (
		<div className="app">
			<APIConfigInfo
				onAPIKeySaved={updateApiKey}
				onChampsSaved={updateChampsSaved}
				/>
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
					<p>Match list for Anthony:</p>
					<button onClick={() => { fetchMatchList(ACCT_ENCRYPTED_ANTHONY) }}>Fetch Anthony's Matchlist (beta)</button>
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
					<p>Match list for Nicole:</p>
					<button onClick={() => { fetchMatchList(ACCT_ENCRYPTED_NICOLE) }}>Fetch Nicole's Matchlist (beta)</button>
					{matchlistNicole.length > 0 && <div className="container-matchlist nicole">
						{matchlistNicole.map(({ champion, gameId, lane, role }) => {
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
					<p>Match list for Vinny:</p>
					<button onClick={() => { fetchMatchList(ACCT_ENCRYPTED_VINNY) }}>Fetch Vinny's Matchlist (beta)</button>
					{matchlistVinny.length > 0 && <div className="container-matchlist vinny">
						{matchlistVinny.map(({ champion, gameId, lane, role }) => {
							const hasChampData = champData !== null
							const specificChamp = hasChampData && champData[champion]

							return (<div className="container-match" key={gameId}>
								<p>Game ID:&nbsp;
									<a
										href={`https://${REGION}.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${devAPIKey}`}
										rel="noopener noreferrer"
										target="_blank">{gameId}</a>
								</p>
								{hasChampData && <div>
									<p>Champion: {specificChamp.name}</p>
								</div>}
								{!hasChampData && <div>
									<p>Champion: {champion}</p>
								</div>}
								<p>Lane: {lane}</p>
								<p>Role: {role}</p>
							</div>)
						})}
					</div>}
				</li>
			</ul>
			<button onClick={toggleSpinMode}>Toggle Spin Mode!</button>
		</div>
	)
}

export { App }
