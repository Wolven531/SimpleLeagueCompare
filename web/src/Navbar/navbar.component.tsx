import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { USERS } from '../constants'

const Navbar: FC = () => {
	return (
		<nav>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/config">API Config</Link>
				</li>
				{USERS.map(({ accountId, name, summonerId }) => {
					return (
						<li key={accountId}>
							<Link to={`/user/${accountId}`}>{name}</Link>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}

export { Navbar }
