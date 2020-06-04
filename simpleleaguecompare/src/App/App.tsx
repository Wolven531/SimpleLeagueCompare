import React, { FC, useState } from 'react'
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom'
import { APIConfigInfo } from '../components/APIConfigInfo'
import { MasteryDisplay } from '../components/MasteryDisplay'
import { MatchlistDisplay } from '../components/MatchDisplay/MatchlistDisplay'
import { Navbar } from '../Navbar/navbar.component'
import {
	ACCT_ENCRYPTED_ANTHONY,
	ACCT_ENCRYPTED_NICOLE,
	ACCT_ENCRYPTED_VINNY,
	API_URL,
	API_V,
	KEY_CHAMPS,
	NAME_ANTHONY,
	NAME_NICOLE,
	NAME_VINNY,
	SUMMONER_ID_ANTHONY,
	SUMMONER_ID_NICOLE,
	SUMMONER_ID_VINNY
} from '../constants'
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
		<Router>
			<div className="app">
				<Navbar/>
				<Switch>
					<Route path="/config">
						<APIConfigInfo
							onAPIKeySaved={updateApiKey}
							onChampsSaved={updateChampsSaved}
							onNumMatchesChanged={updateNumMatches}
							/>
						<div className={isSpinning ? 'spinning' : ''}>
							Champions:&nbsp;
							<a
								href={`https://ddragon.leagueoflegends.com/cdn/${API_V}/data/en_US/champion.json`}
								rel="noopener noreferrer"
								target="_blank"
							>
								//ddragon.leagueoflegends.com/cdn/{API_V}/data/en_US/champion.json
							</a>
						</div>
						<br/>
						<button onClick={toggleSpinMode}>Toggle Spin Mode!</button>
					</Route>
					<Route path="/">
						<ul>
							<li>
								<MasteryDisplay
									apiUrl={API_URL}
									playerName={NAME_ANTHONY}
									summonerId={SUMMONER_ID_ANTHONY}
									/>
								<MatchlistDisplay
									accountKey={ACCT_ENCRYPTED_ANTHONY}
									apiKey={devAPIKey}
									apiUrl={API_URL}
									champData={champData}
									numToFetch={numMatchesToFetch}
									playerName={NAME_ANTHONY}
									/>
							</li>
							<li>
								<MasteryDisplay
									apiUrl={API_URL}
									playerName={NAME_NICOLE}
									summonerId={SUMMONER_ID_NICOLE}
									/>
								<MatchlistDisplay
									accountKey={ACCT_ENCRYPTED_NICOLE}
									apiKey={devAPIKey}
									apiUrl={API_URL}
									champData={champData}
									numToFetch={numMatchesToFetch}
									playerName={NAME_NICOLE}
									/>
							</li>
							<li>
								<MasteryDisplay
									apiUrl={API_URL}
									playerName={NAME_VINNY}
									summonerId={SUMMONER_ID_VINNY}
									/>
								<MatchlistDisplay
									accountKey={ACCT_ENCRYPTED_VINNY}
									apiKey={devAPIKey}
									apiUrl={API_URL}
									champData={champData}
									numToFetch={numMatchesToFetch}
									playerName={NAME_VINNY}
									/>
							</li>
						</ul>
					</Route>
				</Switch>
			</div>
		</Router>
	)
}

export { App }
