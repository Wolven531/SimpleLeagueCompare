import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { FuncUserInfoFetch } from '../common-types'
import { HttpClient, HttpClientResp } from '../utils'

export interface IUserInfoDisplay {
	apiUrl: string
	fetchUserInfo?: FuncUserInfoFetch
}

const netClient = new HttpClient()
const TOKEN_COMP = 'UserInfoDisplay'

const defaultFetchUserInfo: FuncUserInfoFetch = async (apiUrl: string): Promise<Record<string, unknown>> => {
	const TOKEN_FUNC = `[ defaultFetchUserInfo | ${TOKEN_COMP} ]`
	const url = `${apiUrl}/user`

	console.info(`${TOKEN_FUNC} About to fetch user info at "${url}"`)

	try {
		const getResp: HttpClientResp = await netClient.get({ url })

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

	const numExtraLinesToShow = 1
	const numLinesPerUser = 7
	const numUsersToShow = 2
	const textareaRows = numUsersToShow * numLinesPerUser + numExtraLinesToShow
	const textareaDisplayVal = JSON.stringify(userInfo, null, '\t')

	return (
		<div className="user-info-container">
			<h3>Current Users file</h3>
			<textarea
				cols={81}
				readOnly
				rows={textareaRows}
				style={{
					backgroundColor: '#333',
					color: '#ccc',
					padding: 10,
				}}
				value={textareaDisplayVal}
				// more info - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-wrap
				wrap="off"
				/>
			<button onClick={() => { refreshUserInfo(apiUrl, fetchUserInfo, setUserInfo) }}>
				Refresh Info
			</button>
		</div>
	)
}

export { UserInfoDisplay }
