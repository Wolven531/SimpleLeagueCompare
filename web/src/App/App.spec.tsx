import { render, RenderResult } from '@testing-library/react'
import React from 'react'
import { App } from './App'

describe('App', () => {
	let component: RenderResult

	beforeEach(() => {
		component = render(<App />)
	})

	it('renders nav links', () => {
		expect(component.getByText(/Home/)).toBeInTheDocument()
		expect(component.getByText(/API Config/)).toBeInTheDocument()
		expect(component.getByText(/Anthony/)).toBeInTheDocument()
		expect(component.getByText(/Nicole/)).toBeInTheDocument()
		expect(component.getByText(/Vinny/)).toBeInTheDocument()
		expect(component.getByText(/Keenen/)).toBeInTheDocument()
		expect(component.getByText(/Rob/)).toBeInTheDocument()
	})
})
