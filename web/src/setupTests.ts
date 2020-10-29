// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

beforeAll(() => {
	Enzyme.configure({ adapter: new Adapter() })

	jest.spyOn(console, 'error')
		.mockImplementation(jest.fn())
	jest.spyOn(console, 'info')
		.mockImplementation(jest.fn())
	jest.spyOn(console, 'log')
		.mockImplementation(jest.fn())

	// jest.spyOn(NetClient, 'get')
	// 	.mockImplementation(mockGet)
})

afterAll(() => {
	jest.spyOn(console, 'error')
		.mockRestore()
	jest.spyOn(console, 'info')
		.mockRestore()
	jest.spyOn(console, 'log')
		.mockRestore()

	// jest.spyOn(NetClient, 'get')
	// 	.mockRestore()
})
