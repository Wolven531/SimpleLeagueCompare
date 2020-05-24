import React, { FC, useState } from 'react'
import { APIConfigInfo } from '../components/APIConfigInfo'
import { MatchlistDisplay } from '../components/MatchDisplay/MatchlistDisplay'
import {
	ACCT_ENCRYPTED_ANTHONY,
	ACCT_ENCRYPTED_NICOLE,
	ACCT_ENCRYPTED_VINNY,
	API_URL,
	API_V,
	KEY_CHAMPS
} from '../utils'
import './App.css'

// const styles = {
// 	devAPIInput: { fontSize: '1.1em', fontWeight: 'bold', padding: 5, textAlign: 'center', width: '420px' }
// }

const App: FC = () => {
	const [champData, setChampData] = useState<any>(JSON.parse(window.localStorage.getItem(KEY_CHAMPS) || '{}'))
	const [devAPIKey, setDevAPIKey] = useState('')
	const [isSpinning, setIsSpinning] = useState(false)
	const [numMatchesToFetch, setNumMatchesToFetch] = useState(3)

	const toggleSpinMode = () => {
		setIsSpinning(staleSpinning => !staleSpinning)
	}
	const updateApiKey = (newApiKey: string) => { setDevAPIKey(newApiKey) }
	const updateChampsSaved = (newChampMap: any) => {
		if (champData !== newChampMap) {
			setChampData(newChampMap)
		}
	}
	const updateNumMatches = (newNumMatches: number) => {
		setNumMatchesToFetch(newNumMatches)
	}

	return (
		<div className="app">
			<APIConfigInfo
				onAPIKeySaved={updateApiKey}
				onChampsSaved={updateChampsSaved}
				onNumMatchesChanged={updateNumMatches}
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
						apiUrl={API_URL}
						champData={champData}
						numToFetch={numMatchesToFetch}
						playerName="Anthony"
						/>
				</li>
				<li>
					<MatchlistDisplay
						accountKey={ACCT_ENCRYPTED_NICOLE}
						apiKey={devAPIKey}
						apiUrl={API_URL}
						champData={champData}
						numToFetch={numMatchesToFetch}
						playerName="Nicole"
						/>
				</li>
				<li>
					<MatchlistDisplay
						accountKey={ACCT_ENCRYPTED_VINNY}
						apiKey={devAPIKey}
						apiUrl={API_URL}
						champData={champData}
						numToFetch={numMatchesToFetch}
						playerName="Vinny"
						/>
				</li>
			</ul>
			<button onClick={toggleSpinMode}>Toggle Spin Mode!</button>
		</div>
	)
}

export { App }
