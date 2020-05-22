import React, { FC, useState } from 'react'
import { REGION } from '../../utils'
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

	const [matchlist, setMatchlist] = useState<any[]>([])

	const fetchMatchlist = async (encryptedAccountKey: string): Promise<void> => {
		return fetch(`${apiUrl}/matchlist/${encryptedAccountKey}?getLastX=${numToFetch}`)
			.then(response => response.json())
			.then(matches => {
				setMatchlist(matches)
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
				{matchlist.map(({ champion, gameId, lane, role }) => {
					const specificChamp = hasChampData && champData[champion]

					return (<div className="container-match" key={gameId}>
						<p>Game ID:&nbsp;
							<a
								href={`https://${REGION}.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${apiKey}`}
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
		</div>
	)
}

export { MatchlistDisplay }
