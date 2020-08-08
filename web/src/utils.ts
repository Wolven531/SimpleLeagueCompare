import {
	API_V,
	KEY_CHAMPS,
	KEY_CHAMPS_LAST_SAVED
} from './constants'

export const fetchChamps = (): Promise<any> =>
	fetch(`https://ddragon.leagueoflegends.com/cdn/${API_V}/data/en_US/champion.json`)
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

export const fetchTriggerUserRefresh = () : Promise<any> =>
	fetch(`/user/refresh`)
		.catch(err => {
			alert(`Failed to refresh users!\n\n${JSON.stringify(err, null, 4)}`)
		})


export const genTimestamp = (): string => String((new Date()).getTime())
