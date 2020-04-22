import React from 'react'
import { render } from '@testing-library/react'
import { App } from './App'

test('renders league champs link', () => {
  const { getByText } = render(<App />)
  const linkElement = getByText(/Champions:/i)

  expect(linkElement).toBeInTheDocument()
})
