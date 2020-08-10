import React, { FC, useState } from 'react'
import { Game } from '../../models/game.model'
import { Match } from '../../models/match.model'
import { REGION } from '../../constants'
import { StatsDisplay } from '../StatsDisplay'
import './match-display.css'

export interface IMatchlistDisplay {
	accountKey: string
	apiKey: string
	apiUrl: string
	champData: any | null
	numToFetch: number
	playerName: string
}

const MatchlistDisplay: FC<IMatchlistDisplay> = ({ accountKey, apiKey, apiUrl, champData, numToFetch, playerName }) => {
	const hasChampData = champData !== null
	const includeGameData = numToFetch <= 5

	const [matchlist, setMatchlist] = useState<Array<Game | Match>>([])

	const fetchMatchlist = async (encryptedAccountKey: string): Promise<void> => {
		return fetch(`${apiUrl}/matchlist/${encryptedAccountKey}?getLastX=${numToFetch}&includeGameData=${includeGameData}`)
			.then<Array<Game | Match>>(response => response.json())
			.then(
				setMatchlist,
				rejectionReason => {
					console.warn('Fetch matchlist was rejected!', rejectionReason)
	
					throw rejectionReason
				})
			.catch(err => {
				alert(`Failed to fetch matches!\n\n${JSON.stringify(err, null, 4)}`)
			})
	}

	return (
		<div className="matchlist-container">
			<p>Match list for {playerName}:</p>
			<button onClick={() => { fetchMatchlist(accountKey) }}>Fetch {playerName}'s Matchlist</button>
			{matchlist.length > 0 && <div className={`container-matchlist ${playerName}`}>
				{includeGameData && <div>
					<StatsDisplay
						accountId={accountKey}
						apiUrl={apiUrl}
						numToFetch={numToFetch}
						/>
					{matchlist.map(m => {
						const game: Game = m as Game

						return (<div className="container-match" key={game.gameId}>
							<p>Game ID:&nbsp;
								<a
									href={`https://${REGION}.api.riotgames.com/lol/match/v4/matches/${game.gameId}?api_key=${apiKey}`}
									rel="noopener noreferrer"
									target="_blank">{game.gameId}</a>
							</p>
						</div>)
					})}
				</div>}
				{!includeGameData && matchlist.map(m => {
					const match: Match = m as Match
					const specificChamp = hasChampData && champData[match.champion]

					return (<div className="container-match" key={match.gameId}>
						<p>Game ID:&nbsp;
							<a
								href={`https://${REGION}.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${apiKey}`}
								rel="noopener noreferrer"
								target="_blank">{match.gameId}</a>
						</p>
						{hasChampData && <div>
							<p>Champion: {specificChamp.name}</p>
						</div>}
						{!hasChampData && <div>
							<p>Champion: {match.champion}</p>
						</div>}
						<p>Lane: {match.lane}</p>
						<p>Role: {match.role}</p>
					</div>)
				})}
			</div>}
		</div>
	)
}

export { MatchlistDisplay }
