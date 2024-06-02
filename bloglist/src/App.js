import { useState, useEffect, useRef } from 'react'
import { useReducer } from 'react'
import BlogsContext from './BlogsContext'
import notificationReducer from './reducers/notificationReducer'
import errorMessageReducer from './reducers/errorMessageReducer'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBlogs, createBlog, updateBlog, removeBlog } from './requests'

import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import ErrorMessage from './components/ErrorMessage'
import NotificationMessage from './components/NotificationMessage'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  //const [errorMessage, setErrorMessage] = useState('')
  const blogFormRef = useRef()
  const [notificationMessage, notificationDispatch] = useReducer(
    notificationReducer,
    null,
  )
  const [errorMessage, errorMessageDispatch] = useReducer(
    errorMessageReducer,
    null,
  )

  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    refetchOnWindowFocus: false,
  })

  const blogs = result.data

  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      notificationDispatch({
        type: 'notificationShow',
        payload: `Blog ${newBlog.title} added`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'notificationHide', payload: null })
      }, 2000)
    },
    onError: () => {
      errorMessageDispatch({
        type: 'errorMessageShow',
        payload: `Saving blog failed.`,
      })
      setTimeout(() => {
        errorMessageDispatch({ type: 'errorMessageHide', payload: null })
      }, 2000)
      /*setErrorMessage(`Saving blog failed.`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)*/
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries(['blogs'])
      notificationDispatch({
        type: 'notificationShow',
        payload: `Blog ${updatedBlog.title} updated`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'notificationHide', payload: null })
      }, 2000)
    },
    onError: () => {
      /*setErrorMessage(`Updating blog failed.`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)*/
    },
  })

  const removeBlogMutation = useMutation({
    mutationFn: removeBlog,
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries(['blogs'])
      notificationDispatch({
        type: 'notificationShow',
        payload: 'Blog deleted',
      })
      setTimeout(() => {
        notificationDispatch({ type: 'notificationHide', payload: null })
      }, 2000)
    },
    onError: () => {
      /*setErrorMessage('Deleting blog failed.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)*/
    },
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleAddBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate({ newBlog: blogObject, user: user })
  }

  const handleupdateBlog = (blogObject) => {
    updateBlogMutation.mutate({ updateBlog: blogObject, user: user })
  }

  const handleRemoveBlog = (id) => {
    removeBlogMutation.mutate({ id: id, user: user })
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notificationDispatch({
        type: 'notificationShow',
        payload: `User ${user.name} logged in`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'notificationHide', payload: null })
      }, 2000)
    } catch (exception) {
      /*setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)*/
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
      notificationDispatch({
        type: 'notificationShow',
        payload: `User ${user.name} logged out`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'notificationHide', payload: null })
      }, 2000)
    } catch (exception) {
      /*setErrorMessage(`User ${user.name} logged failed`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)*/
    }
  }

  return (
    <BlogsContext.Provider
      value={
        ([notificationMessage, notificationDispatch],
        [errorMessage, errorMessageDispatch])
      }
    >
      <div>
        <h2>blogs</h2>
        {errorMessage && <ErrorMessage></ErrorMessage>}
        {notificationMessage && <NotificationMessage></NotificationMessage>}
        {user === null && (
          <LoginForm
            username={username}
            password={password}
            handleLogin={handleLogin}
            handleUsernameChange={handleUsernameChange}
            handlePasswordChange={handlePasswordChange}
          ></LoginForm>
        )}
        {user && (
          <>
            <div>
              {user.name} logged in
              <form onSubmit={handleLogout} style={{ display: 'inline' }}>
                <button type="submit" id="logoutbutton">
                  logout
                </button>
              </form>
            </div>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm createBlog={handleAddBlog} />
            </Togglable>
            <div>
              {blogs &&
                blogs
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
                    <Blog
                      key={blog.id}
                      blog={blog}
                      user={user}
                      updateBlog={handleupdateBlog}
                      removeBlog={handleRemoveBlog}
                    />
                  ))}
            </div>
          </>
        )}
      </div>
    </BlogsContext.Provider>
  )
}

export default App
