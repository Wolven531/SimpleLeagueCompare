import { render, RenderResult } from '@testing-library/react'
import React from 'react'
import { HttpClientResp, NetClient } from '../utils'
import { UserInfoDisplay } from './UserInfoDisplay'

describe('UserInfoDisplay', () => {
	let component: RenderResult

	beforeEach(() => {
		const mockGet = jest.fn(() => Promise.resolve({
			body: {},
			status: 200,
		} as HttpClientResp))

		jest.spyOn(NetClient, 'get')
			.mockImplementation(mockGet)

		component = render(<UserInfoDisplay apiUrl="http://some-api.com" />)
	})

	afterEach(() => {
		jest.spyOn(NetClient, 'get')
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
