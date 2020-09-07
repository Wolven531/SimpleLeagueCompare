import axios from 'axios'
import {
	API_V,
	KEY_CHAMPS,
	KEY_CHAMPS_LAST_SAVED,
	NETWORK_TIMEOUT
} from './constants'

export const fetchChamps = (): Promise<{}> => {
	const axiosInstance = axios.create({
		baseURL: 'https://ddragon.leagueoflegends.com/',
		headers: {},
		timeout: NETWORK_TIMEOUT,
	})
	return axiosInstance.get(`cdn/${API_V}/data/en_US/champion.json`)
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
			alert(`Failed to retrieve champs!\n\n${JSON.stringify(err, null, 4)}`)
		})
}

export const fetchTriggerUserRefresh = () : Promise<any> => {
	const axiosInstance = axios.create({
		baseURL: '/',
		headers: {},
		timeout: NETWORK_TIMEOUT,
	})
	return axiosInstance.get('/user/refresh')
		.catch(err => {
			alert(`Failed to refresh users!\n\n${JSON.stringify(err, null, 4)}`)
		})
}


export const genTimestamp = (): string => String((new Date()).getTime())
