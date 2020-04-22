import React from 'react'
import './App.css'

const App = () => {
  const API_V = '10.8.1'

  return (
    <div className="app">
      <ul>
        <li>
          Champions:&nbsp;
          <a
            href={`//ddragon.leagueoflegends.com/cdn/${API_V}/data/en_US/champion.json`}
            rel="noopener noreferrer"
            target="_blank"
            >//ddragon.leagueoflegends.com/cdn/{API_V}/data/en_US/champion.json</a></li>
      </ul>
    </div>
  )
}

export { App }
