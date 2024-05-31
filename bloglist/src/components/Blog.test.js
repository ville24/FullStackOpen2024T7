import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
  let container
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      name: 'Matti Meikäläinen',
      username: 'mmeikala',
    },
  }
  const user = {
    name: 'Matti Meikäläinen',
    username: 'mmeikala',
  }

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={() => {}}
        removeBlog={() => {}}
      />,
    ).container
  })

  test('renders content', () => {
    screen.getByText('React patterns')
    screen.getByText('Michael Chan')
  })

  test('at start the details are not displayed', () => {
    const div = container.querySelector('.blogDetails')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, details are displayed', async () => {
    const userClick = userEvent.setup()
    const button = screen.getByText('view')
    await userClick.click(button)

    const div = container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display: none')
  })
})

describe('Blog udpdate', () => {
  test('updates two likes', async () => {
    const blog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: {
        name: 'Matti Meikäläinen',
        username: 'mmeikala',
      },
    }
    const user = {
      name: 'Matti Meikäläinen',
      username: 'mmeikala',
    }

    const userClick = userEvent.setup()
    const updateBlog = jest.fn()

    render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={updateBlog}
        removeBlog={() => {}}
      />,
    )

    const button = screen.getByText('like')
    await userClick.click(button)
    await userClick.click(button)

    expect(updateBlog.mock.calls).toHaveLength(2)
    expect(updateBlog.mock.calls[0][0].likes).toBe(8)
    expect(updateBlog.mock.calls[1][0].likes).toBe(8)
  })
})
