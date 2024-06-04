import { useEffect, useRef } from 'react'
import { useReducer } from 'react'
import BlogsContext from './BlogsContext'
import notificationReducer from './reducers/notificationReducer'
import errorMessageReducer from './reducers/errorMessageReducer'
import userReducer from './reducers/userReducer'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBlogs, createBlog, updateBlog, removeBlog } from './requests'

import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import ErrorMessage from './components/ErrorMessage'
import NotificationMessage from './components/NotificationMessage'

const App = () => {
  const blogFormRef = useRef()
  const [user, userDispatch] = useReducer(
    userReducer,
    null
  )
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
      errorMessageDispatch({
        type: 'errorMessageShow',
        payload: `Updating blog failed.`,
      })
      setTimeout(() => {
        errorMessageDispatch({ type: 'errorMessageHide', payload: null })
      }, 2000)
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
      errorMessageDispatch({
        type: 'errorMessageShow',
        payload: 'Deleting blog failed.',
      })
      setTimeout(() => {
        errorMessageDispatch({ type: 'errorMessageHide', payload: null })
      }, 2000)
    },
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({
        type: 'addUser',
        payload: user,
      })
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

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      userDispatch({
        type: 'removeUser',
        payload: null,
      })
      notificationDispatch({
        type: 'notificationShow',
        payload: `User ${user.name} logged out`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'notificationHide', payload: null })
      }, 2000)
    } catch (exception) {
      errorMessageDispatch({
        type: 'errorMessageShow',
        payload: `User ${user.name} logged failed`,
      })
      setTimeout(() => {
        errorMessageDispatch({ type: 'errorMessageHide', payload: null })
      }, 2000)
    }
  }
  
  return (
    <BlogsContext.Provider
        value={{
          notification: [notificationMessage, notificationDispatch], 
          error: [errorMessage, errorMessageDispatch],
          user: [user, userDispatch]
        }}
    >
      <div>
        <h2>blogs</h2>
        {errorMessage && <ErrorMessage />}
        {notificationMessage && <NotificationMessage />}
        {user === null && (
          <LoginForm />
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
