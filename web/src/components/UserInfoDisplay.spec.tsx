import { render, RenderResult } from '@testing-library/react'
import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import { HttpClientResp, NetClient } from '../utils'
import { UserInfoDisplay } from './UserInfoDisplay'

type TestCase_UserInfoDisplay = {
	mockGet: jest.Mock
	testDescription: string
}

describe('UserInfoDisplay', () => {
	const fakeApiUrl = 'http://some-api.com'
	const testCases: TestCase_UserInfoDisplay[] = [
		{
			mockGet: jest.fn(() => Promise.resolve({
				body: {},
				status: 200,
			} as HttpClientResp)),
			testDescription: 'when GET returns 200, body is empty object',
		},
		{
			mockGet: jest.fn(() => Promise.resolve({
				body: '',
				context: {
					cookies: {},
				},
				status: 404,
			} as HttpClientResp)),
			testDescription: 'when GET returns 404 (API not found), body is empty string',
		},
		{
			mockGet: jest.fn(() => Promise.reject(new Error('simulated error for unit test'))),
			testDescription: 'when GET fails (client is offline), body is empty string',
		},
	]

	testCases.forEach(({ mockGet, testDescription }) => {
		let component: RenderResult

		describe(`${testDescription}`, () => {
			beforeEach(() => {
				jest.spyOn(NetClient, 'get')
					.mockImplementation(mockGet)

				component = render(<UserInfoDisplay apiUrl={fakeApiUrl} />)
			})

			afterEach(() => {
				jest.spyOn(NetClient, 'get')
					.mockRestore()
			})

			it('invokes GET, renders container, header, and refresh button', () => {
				expect(mockGet).toHaveBeenCalledTimes(1)
				expect(mockGet).toHaveBeenLastCalledWith({
					url: `${fakeApiUrl}/user`,
				})

				const elems = component.baseElement.getElementsByClassName('user-info-container')
				expect(elems).toHaveLength(1)
				expect(elems[0]).toBeInTheDocument()
		
				expect(component.getByText(/Current Users file/g)).toBeInTheDocument()
				expect(component.getByText(/Refresh Info/g)).toBeInTheDocument()
			})
		})
	})

	describe('when refresh info button fires click event', () => {
		let mockGet: jest.Mock
		let component: ShallowWrapper

		beforeEach(() => {
			mockGet = jest.fn(() => Promise.resolve({
				body: {},
				status: 200,
			} as HttpClientResp))

			jest.spyOn(NetClient, 'get')
				.mockImplementation(mockGet)

			component = shallow(<UserInfoDisplay apiUrl={fakeApiUrl} />)

			const refreshButton = component.find('button')

			expect(refreshButton.text()).toBe('Refresh Info')

			refreshButton.simulate('click')
		})

		afterEach(() => {
			jest.spyOn(NetClient, 'get')
				.mockRestore()
		})

		it('invokes GET', () => {
			expect(mockGet).toHaveBeenCalledTimes(1)
			expect(mockGet).toHaveBeenLastCalledWith({
				url: `${fakeApiUrl}/user`,
			})
		})
	})
})
