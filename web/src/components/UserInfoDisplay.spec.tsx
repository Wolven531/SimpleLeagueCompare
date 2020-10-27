import { render, RenderResult } from '@testing-library/react'
import React from 'react'
import { UserInfoDisplay } from './UserInfoDisplay'

describe('UserInfoDisplay', () => {
	let component: RenderResult

	beforeEach(() => {
		jest.spyOn(console, 'error')
			.mockImplementation(jest.fn())
		jest.spyOn(console, 'info')
			.mockImplementation(jest.fn())
		jest.spyOn(console, 'log')
			.mockImplementation(jest.fn())

		component = render(<UserInfoDisplay apiUrl="http://some-api.com" />)
	})

	afterEach(() => {
		jest.spyOn(console, 'error')
			.mockRestore()
		jest.spyOn(console, 'info')
			.mockRestore()
		jest.spyOn(console, 'log')
			.mockRestore()
	})

	it('renders container, header, and refresh button', () => {
		const elems = component.baseElement.getElementsByClassName('user-info-container')
		expect(elems).toHaveLength(1)
		expect(elems[0]).toBeInTheDocument()

		expect(component.getByText(/Current Users file/g)).toBeInTheDocument()
		expect(component.getByText(/Refresh Info/g)).toBeInTheDocument()
	})
})
