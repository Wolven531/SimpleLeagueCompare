import React, { FC, useState } from 'react'
import { APIConfigInfo } from '../components/APIConfigInfo'
import { MatchlistDisplay } from '../components/MatchlistDisplay'
import { KEY_CHAMPS } from '../utils'
import './App.css'

// const styles = {
// 	devAPIInput: { fontSize: '1.1em', fontWeight: 'bold', padding: 5, textAlign: 'center', width: '420px' }
// }

const App: FC = () => {
	const ACCT_ENCRYPTED_ANTHONY = 'U9b-KVWyJkTpQR0YiPJt7U8DFqy5llDfTJZYV56-G7onXevEOMC_DiI1'
	const ACCT_ENCRYPTED_NICOLE = 'Cn0MOwyHpDXOLaCqpbkwMoIs1M8r9IJnv39DOM867E1zTjE'
	const ACCT_ENCRYPTED_VINNY = 'aME0ZGruQhV8etyYYIys4vqFarj13QyvFztnwVIHImEgEgiwl7OLPsRE'
	const API_V = '10.8.1'

	const [champData, setChampData] = useState<any>(JSON.parse(window.localStorage.getItem(KEY_CHAMPS) || '{}'))
	const [devAPIKey, setDevAPIKey] = useState('')
	const [isSpinning, setIsSpinning] = useState(false)

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
					<MatchlistDisplay
						accountKey={ACCT_ENCRYPTED_ANTHONY}
						apiKey={devAPIKey}
						champData={champData}
						playerName="Anthony"
						/>
				</li>
				<li>
					<MatchlistDisplay
						accountKey={ACCT_ENCRYPTED_NICOLE}
						apiKey={devAPIKey}
						champData={champData}
						playerName="Nicole"
						/>
				</li>
				<li>
					<MatchlistDisplay
						accountKey={ACCT_ENCRYPTED_VINNY}
						apiKey={devAPIKey}
						champData={champData}
						playerName="Vinny"
						/>
				</li>
			</ul>
			<button onClick={toggleSpinMode}>Toggle Spin Mode!</button>
		</div>
	)
}

export { App }
