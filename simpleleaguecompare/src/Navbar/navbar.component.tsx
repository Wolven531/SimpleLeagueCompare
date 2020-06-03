import React, { FC } from 'react'
import { Link } from 'react-router-dom'

const Navbar: FC = () => {
	return (
		<nav>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
			</ul>
		</nav>
	)
}

export { Navbar }
