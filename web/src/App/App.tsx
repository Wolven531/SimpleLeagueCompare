import Axios, { AxiosInstance } from 'axios'
import React, { FC, useEffect, useState } from 'react'
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom'
import { APIConfigInfo } from '../components/APIConfigInfo'
import { MasteryDisplay } from '../components/MasteryDisplay'
import { MatchlistDisplay } from '../components/MatchDisplay/MatchlistDisplay'
import { UserInfoDisplay } from '../components/UserInfoDisplay'
import {
	API_URL,
	API_V,
	KEY_CHAMPS,
	USERS
} from '../constants'
import { Navbar } from '../Navbar/navbar.component'
import './App.css'

// const styles = {
// 	devAPIInput: { fontSize: '1.1em', fontWeight: 'bold', padding: 5, textAlign: 'center', width: '420px' }
// }

const App: FC = () => {
	const [champData, setChampData] = useState<any>(JSON.parse(window.localStorage.getItem(KEY_CHAMPS) || '{}'))
	// const [devAPIKey, setDevAPIKey] = useState('')
	const [devAPIKey] = useState('')
	const [isSpinning, setIsSpinning] = useState(false)
	const [numMatchesToFetch, setNumMatchesToFetch] = useState(3)

	const promptForRiotNavigation = (msg: string) => {
		if (window.confirm(msg)) {
			window.open('//developer.riotgames.com', '_blank')
		}
	}
	const checkAPIToken = async () => {
		const axios: AxiosInstance = Axios.create({
			baseURL: 'http://localhost:3050'
		})
		const msgAPIUnavailable = 'Could not contact API, 💔. Go to Riot to regenerate?'
		const msgInvalidToken = 'API Token is not valid, 😥. Go to Riot to regenerate?'

		try {
			const getResp = await axios.get<boolean>('/app/check-token')
			const isTokenValid = getResp.data

			if (!isTokenValid) {
				promptForRiotNavigation(msgInvalidToken)
			}
		} catch (err) { // NOTE - if API is not running, this catch handles it
			promptForRiotNavigation(msgAPIUnavailable)
		}
	}

	const toggleSpinMode = () => {
		setIsSpinning(staleSpinning => !staleSpinning)
	}
	// const updateApiKey = (newApiKey: string) => { setDevAPIKey(newApiKey) }
	const updateChampsSaved = (newChampMap: any) => {
		if (champData !== newChampMap) {
			setChampData(newChampMap)
		}
	}
	const updateNumMatches = (newNumMatches: number) => {
		setNumMatchesToFetch(newNumMatches)
	}

	useEffect(() => {
		checkAPIToken()
	})

	return (
		<Router>
			<div className="app">
				<Navbar/>
				<Switch>
					<Route path="/config">
						<APIConfigInfo
							// onAPIKeySaved={updateApiKey}
							onAPIKeySaved={() => { return }}
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
								{`//ddragon.leagueoflegends.com/cdn/${API_V}/data/en_US/champion.json`}
							</a>
						</div>
						<br/>
						<button onClick={toggleSpinMode}>Toggle Spin Mode!</button>
					</Route>
					<Route path="/user-info">
						<UserInfoDisplay apiUrl={API_URL} />
					</Route>
					{USERS.map(({ accountId, name, summonerId }) => {
						return (
							<Route key={accountId} path={`/user/${accountId}`}>
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
							</Route>
						)
					})}
					<Route path="/">
						<h2>Welcome</h2>
					</Route>
				</Switch>
			</div>
		</Router>
	)
}

export { App }

