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
	API_URL,
	API_V,
	KEY_CHAMPS,
	USERS
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
							{USERS.map(({ accountId, name, summonerId }) => {
								return (
									<li key={accountId}>
										<MasteryDisplay
											apiUrl={API_URL}
											playerName={name}
											summonerId={summonerId}
											/>
										<MatchlistDisplay
											accountKey={accountId}
											apiKey={devAPIKey}
											apiUrl={API_URL}
											champData={champData}
											numToFetch={numMatchesToFetch}
											playerName={name}
											/>
									</li>
								)
							})}
						</ul>
					</Route>
				</Switch>
			</div>
		</Router>
	)
}

export { App }
