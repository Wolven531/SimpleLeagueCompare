import React, { FC, useEffect, useState } from 'react'
import { FuncUserInfoFetch } from '../common-types'

export interface IUserInfoDisplay {
	apiUrl: string
	fetchUserInfo?: FuncUserInfoFetch
}

const TOKEN_COMP = 'UserInfoDisplay'

const defaultFetchUserInfo: FuncUserInfoFetch = (apiUrl: string): Promise<any> => {
	const TOKEN_FUNC = `[ fetchUserInfoDefault | ${TOKEN_COMP} ]`
	const url = `${apiUrl}/user`

	return fetch(url)
		.then(response => response.json())
		.then((userInfo: Record<string, unknown>) => {
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

	return (
		<div className="user-info-container">
			<p>
			</p>
		</div>
	)
}

export { UserInfoDisplay }
