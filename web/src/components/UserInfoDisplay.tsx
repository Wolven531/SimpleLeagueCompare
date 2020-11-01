import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import ReactJson from 'react-json-view'
import { FuncUserInfoFetch } from '../common-types'
import { HttpClientResp, NetClient } from '../utils'

export interface IUserInfoDisplay {
	apiUrl: string
	fetchUserInfo?: FuncUserInfoFetch
}

const TOKEN_COMP = 'UserInfoDisplay'

const defaultFetchUserInfo: FuncUserInfoFetch = async (apiUrl: string): Promise<Record<string, unknown>> => {
	const TOKEN_FUNC = `[ defaultFetchUserInfo | ${TOKEN_COMP} ]`
	const url = `${apiUrl}/user`

	console.info(`${TOKEN_FUNC} About to fetch user info at "${url}"`)

	try {
		const getResp: HttpClientResp = await NetClient.get({ url })

		console.log(`${TOKEN_FUNC} Successfully got JSON and parsed to object`)

		return getResp.body as Record<string, unknown>
	} catch (err) {
		console.error(`${TOKEN_FUNC} Fetch user info failed!`, err)

		return {}
	}
}

const refreshUserInfo = (
	apiUrl: string,
	fetchFunc: (url: string) => Promise<Record<string, unknown>>,
	setFunc: Dispatch<SetStateAction<Record<string, unknown>>>,
): Promise<void> => {
	return fetchFunc(apiUrl).then(setFunc)
}

const UserInfoDisplay: FC<IUserInfoDisplay> = ({
	apiUrl,
	fetchUserInfo = defaultFetchUserInfo,
}) => {
	const [userInfo, setUserInfo] = useState<Record<string, unknown>>({})

	useEffect(() => {
		refreshUserInfo(apiUrl, fetchUserInfo, setUserInfo)
	}, [apiUrl, fetchUserInfo])

	return (
		<div className="user-info-container">
			<h3>Current Users file</h3>
			<ReactJson
				collapsed={1}
				name={false}
				sortKeys={true}
				src={userInfo}
				style={{ textAlign: 'left' }}
				theme="harmonic"
				/>
			<button onClick={() => { refreshUserInfo(apiUrl, fetchUserInfo, setUserInfo) }}>
				Refresh Info
			</button>
		</div>
	)
}

export { UserInfoDisplay }
