export const API_URL = process.env.REACT_APP_API_URL
export const API_V = '10.8.1'

export const KEY_API_KEY = 'simpleLeagueCompare.API-dev'
export const KEY_CHAMPS = 'simpleLeagueCompare.champs'
export const KEY_CHAMPS_LAST_SAVED = 'simpleLeagueCompare.saved.champs'

export const fetchChamps = async (): Promise<any> => {
	return fetch(`https://ddragon.leagueoflegends.com/cdn/${API_V}/data/en_US/champion.json`)
		.then(resp => resp.json())
		.then(({ data }) => {
			const champMap: any = {}
			const champNames = Object.keys(data)

			champNames.forEach(name => {
				const champ = data[name]
				champMap[champ.key] = champ
			})

			window.localStorage.setItem(KEY_CHAMPS, JSON.stringify(champMap))
			window.localStorage.setItem(KEY_CHAMPS_LAST_SAVED, genTimestamp())

			return champMap
		})
		.catch(err => {
			alert(`Failed to fetch champs!\n\n${JSON.stringify(err, null, 4)}`)
		})
}

export const genTimestamp = (): string => String((new Date()).getTime())
