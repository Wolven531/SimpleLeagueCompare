import React, { useState } from 'react'
import './App.css'

const App = () => {
  const API_V = '10.8.1'
  
  let [isSpinning, setIsSpinning] = useState(false)
  const toggleSpinMode = () => { setIsSpinning(staleSpinning => !staleSpinning) }

  return (
    <div className="app">
      <ul>
        <li className={ isSpinning ? 'spinning' : '' }>
          Champions:&nbsp;
          <a
            href={`//ddragon.leagueoflegends.com/cdn/${API_V}/data/en_US/champion.json`}
            rel="noopener noreferrer"
            target="_blank"
            >//ddragon.leagueoflegends.com/cdn/{API_V}/data/en_US/champion.json</a></li>
      </ul>
      <button onClick={toggleSpinMode}>
        Toggle Spin Mode!
      </button>
    </div>
  )
}

export { App }
