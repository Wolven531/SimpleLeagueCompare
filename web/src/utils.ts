import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { Agent as HttpAgent, AgentOptions as HttpAgentOptions } from 'http'
import { Agent as HttpsAgent, AgentOptions as HttpsAgentOptions } from 'https'
import { stringify } from 'querystring'
import { Cookie, CookieJar } from 'tough-cookie'
import {
	API_V,
	KEY_CHAMPS,
	KEY_CHAMPS_LAST_SAVED,
	NETWORK_TIMEOUT
} from './constants'

export interface CookieMap {
	[key: string]: string
}

export interface Headers {
	[key: string]: string | string[]
}

export interface HttpClientResp {
	body: Record<string, unknown> | Record<string, unknown>[] | string
	context: HttpClientRespCtx
	status: number
}

export interface HttpClientRespCtx {
	cookies: CookieMap
	headers: Headers
}

export class HttpClient {
	/**
	 * 
	 * @param cookieObjectStringOrArray 
	 */
	static transformCookiesToString(cookieObjectStringOrArray: CookieMap | string | string[]): string {
		// if already string, just return it
		if (typeof cookieObjectStringOrArray === 'string') {
			return cookieObjectStringOrArray
		}
		
		// if array, convert to single string
		if (Array.isArray(cookieObjectStringOrArray)) {
			return cookieObjectStringOrArray.map((fullCookieString: string) => {
				const cookie: Cookie = Cookie.parse(fullCookieString) as Cookie

				return `${cookie.key}=${cookie.value};`
			}).join('')
		}
	
		// otherwise, treat as plain object w/ key/value props
		return Object.keys(cookieObjectStringOrArray)
			.map(key => `${key}=${cookieObjectStringOrArray[key]}`)
			.join(';')
	}

	private static readonly DEFAULT_AGENT_OPTS: HttpAgentOptions | HttpsAgentOptions = {
		keepAlive: true,
		rejectUnauthorized: false,
	}
	private static readonly DEFAULT_REQ_CONFIG: AxiosRequestConfig = {
		headers: {
			// NOTE - header below considered "unsafe" by browsers
			// 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
		},
		httpAgent: new HttpAgent(HttpClient.DEFAULT_AGENT_OPTS as HttpAgentOptions),
		httpsAgent: new HttpsAgent(HttpClient.DEFAULT_AGENT_OPTS as HttpsAgentOptions),
		jar: new CookieJar(),
		// NOTE - prop below causes CORS issues w/ local API
		// withCredentials: true,
	}

	/**
	 * 
	 * @param data 
	 * @param headers 
	 */
	private static doesDataNeedStringify(data: any, headers: Headers = {}): boolean {
		const contentTypeKey: string = Object.keys(headers).find(key => key.toLowerCase() === 'content-type') || 'content-type'

		if (!headers[contentTypeKey]) {
			headers[contentTypeKey] = 'application/x-www-form-urlencoded'
		}

		const shouldBeString: boolean = headers[contentTypeKey] === 'application/x-www-form-urlencoded'

		return shouldBeString && typeof data !== 'string'
	}

	private readonly axios: AxiosInstance
	private resp: AxiosResponse | undefined

	constructor() {
		axiosCookieJarSupport(Axios)
		this.axios = Axios.create(HttpClient.DEFAULT_REQ_CONFIG)
	}

	/**
	 * 
	 * @param config 
	 */
	async get(config: AxiosRequestConfig): Promise<HttpClientResp> {
		this.resp = await this.axios({
			...config,
			method: 'GET',
		})

		return {
			body: this.resp?.data,
			context: {
				cookies: this.getCookieMap(),
				headers: this.resp?.headers,
			},
			status: this.resp?.status,
		}
	}

	/**
	 * 
	 * @param config 
	 */
	async post(config: AxiosRequestConfig): Promise<HttpClientResp> {
		this.resp = await this.axios({
			...HttpClient.doesDataNeedStringify(config.data, config.headers)
				? stringify(config.data)
				: config.data,
			method: 'POST',
		})

		return {
			body: this.resp?.data,
			context: {
				cookies: this.getCookieMap(),
				headers: this.resp?.headers,
			},
			status: this.resp?.status,
		}
	}

	/**
	 * 
	 * @param cookieInfo 
	 */
	setCookieHeader(cookieInfo: CookieMap | string | string[]) {
		this.axios.defaults.headers.Cookie = HttpClient.transformCookiesToString(cookieInfo)
	}

	/**
	 * Set the request headers for future requests
	 * @param headers 
	 */
	setHeaders(headers: Headers) {
		this.axios.defaults.headers = headers
	}

	/**
	 * 
	 * @param proxyAgent 
	 */
	setProxy(proxyAgent: HttpAgent | HttpsAgent) {
		// merge proxy-agent with default https-agent to use default agent configuration
		const httpProxyAgent: HttpAgent | HttpsAgent = Object.assign(proxyAgent, HttpClient.DEFAULT_REQ_CONFIG.httpsAgent)
		this.axios.defaults.httpAgent = httpProxyAgent as HttpAgent
		this.axios.defaults.httpsAgent = httpProxyAgent as HttpsAgent
	}

	/**
	 * 
	 * @param callback 
	 */
	setResponseInterceptor(callback: (data: any) => Promise<any>) {
		this.axios.interceptors.response.use(
			async (resp) => {
				await callback(resp)
				return resp
			},
			async (error) => {
				await callback(error)
				throw error
			}
		)
	}

	/**
	 * Return the last response's cookies merged on top of the default configured cookies
	 */
	private getCookieMap(): CookieMap {
		const configCookiesString: string = this.resp?.config.headers?.Cookie
		const configCookies: string[] = configCookiesString ? String(configCookiesString).split(';').map(c => c.trim()) : []
		const headerCookies: string[] = this.resp?.headers['set-cookie'] || []
		const nonJarCookies = configCookies?.concat(headerCookies)
		const cookieMap: CookieMap = {}

		if (this.resp?.config.jar) {
			const jarCookies: CookieJar.Serialized = (this.resp.config.jar as CookieJar).toJSON()

			jarCookies.cookies.forEach((cookiesItem: any) => {
				cookieMap[cookiesItem.key] = cookiesItem.value
			})
		}

		if (nonJarCookies?.length) {
			nonJarCookies.forEach((cookie) => {
				const [key, value] = cookie.split(';')[0].split('=')
				cookieMap[key] = value
			})
		}

		return cookieMap
	}
}

export const NetClient = new HttpClient()

export const fetchChamps = (): Promise<{}> => {
	const axiosInstance = Axios.create({
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
	const axiosInstance = Axios.create({
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
