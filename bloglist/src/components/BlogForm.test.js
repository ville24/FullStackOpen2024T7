import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  test('blog creation test', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    const container = render(<BlogForm createBlog={createBlog} />).container

    const titleField = container.querySelector("[name='title']")
    await user.type(titleField, 'React patterns')

    const authorField = container.querySelector("[name='author']")
    await user.type(authorField, 'Michael Chan')

    const urlField = container.querySelector("[name='url']")
    await user.type(urlField, 'https://reactpatterns.com/')

    const button = screen.getByText('create')
    await user.click(button)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('React patterns')
    expect(createBlog.mock.calls[0][0].author).toBe('Michael Chan')
    expect(createBlog.mock.calls[0][0].url).toBe('https://reactpatterns.com/')
  })
})
