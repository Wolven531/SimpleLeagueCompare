import React, { FC, useEffect, useState } from 'react'
import { FuncUserInfoFetch } from '../common-types'

export interface IUserInfoDisplay {
	apiUrl: string
	fetchUserInfo?: FuncUserInfoFetch
}

const TOKEN_COMP = 'UserInfoDisplay'

const defaultFetchUserInfo: FuncUserInfoFetch = (apiUrl: string): Promise<Record<string, unknown>> => {
	const TOKEN_FUNC = `[ defaultFetchUserInfo | ${TOKEN_COMP} ]`
	const url = `${apiUrl}/user`

	console.info(`${TOKEN_FUNC} About to fetch user info at "${url}"`)

	return fetch(url)
		.then(response => response.json())
		.then((userInfo: Record<string, unknown>) => {
			console.log(`${TOKEN_FUNC} Successfully got JSON and parsed to object`)

			return userInfo
		})
		.catch(err => {
			console.error(`${TOKEN_FUNC} Fetch user info failed!`, err)

			return {}
		})
}

const UserInfoDisplay: FC<IUserInfoDisplay> = ({
	apiUrl,
	fetchUserInfo = defaultFetchUserInfo,
}) => {
	const [userInfo, setUserInfo] = useState<Record<string, unknown>>({})

	useEffect(() => {
		fetchUserInfo(apiUrl).then(setUserInfo)
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
		</div>
	)
}

export { UserInfoDisplay }
