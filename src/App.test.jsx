import { describe, it, afterEach } from 'vitest'
import { screen, render, cleanup } from '@testing-library/react'
import App from './App'
describe('Main App', () => {
  afterEach(cleanup)
  it('Should render', () => {
    render(<App />)
  })
  it('Should render a title ', () => {
    render(<App />)
    screen.getByText('DIAGRAM EDITOR')
  })
})
