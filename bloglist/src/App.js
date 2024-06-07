import { useEffect, useRef } from 'react'
import { useReducer } from 'react'
import BlogsContext from './BlogsContext'
import notificationReducer from './reducers/notificationReducer'
import errorMessageReducer from './reducers/errorMessageReducer'
import userReducer from './reducers/userReducer'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getBlogs,
  createBlog,
  updateBlog,
  removeBlog,
  getUsers,
  updateComment,
} from './requests'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import ErrorMessage from './components/ErrorMessage'
import NotificationMessage from './components/NotificationMessage'
import UserBlogs from './components/UserBlogs'

const App = () => {
  const blogFormRef = useRef()
  const [user, userDispatch] = useReducer(userReducer, null)
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

  const resultUsers = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
  })
  const users = resultUsers.data

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
    onSuccess: () => {
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

  const updateCommentMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      notificationDispatch({
        type: 'notificationShow',
        payload: 'Comment saved',
      })
      setTimeout(() => {
        notificationDispatch({ type: 'notificationHide', payload: null })
      }, 2000)
    },
    onError: (error) => {
      console.log(error)
      errorMessageDispatch({
        type: 'errorMessageShow',
        payload: 'Saving comment failed.',
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

  const handleUpdateBlog = (blogObject) => {
    updateBlogMutation.mutate({ updateBlog: blogObject, user: user })
  }

  const handleRemoveBlog = (id) => {
    removeBlogMutation.mutate({ id: id, user: user })
  }

  const handleUpdateComment = (commentObj) => {
    updateCommentMutation.mutate(commentObj)
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

  const padding = {
    padding: 5,
  }

  return (
    <Router>
      <BlogsContext.Provider
        value={{
          notification: [notificationMessage, notificationDispatch],
          error: [errorMessage, errorMessageDispatch],
          user: [user, userDispatch],
        }}
      >
        <div>
          <Link style={padding} to="/blogs">
            blogs
          </Link>
          <Link style={padding} to="/users">
            users
          </Link>
          {user === null && <LoginForm />}
          {user && (
            <>
              {user.name} logged in
              <form onSubmit={handleLogout} style={{ display: 'inline' }}>
                <button type="submit" id="logoutbutton">
                  logout
                </button>
              </form>
            </>
          )}
          {errorMessage && <ErrorMessage />}
          {notificationMessage && <NotificationMessage />}
        </div>
        <Routes>
          <Route path="/" element={<Navigate replace to="/blogs" />} />
          <Route
            path="/blogs"
            element={
              <div>
                <h1>Blogs</h1>
                {user && (
                  <Togglable buttonLabel="new blog" ref={blogFormRef}>
                    <BlogForm createBlog={handleAddBlog} />
                  </Togglable>
                )}
                <div>
                  {blogs &&
                    blogs.map((blog) => (
                      <div key={blog.id}>
                        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                      </div>
                    ))}
                </div>
              </div>
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blogs={blogs}
                user={user}
                updateBlog={handleUpdateBlog}
                removeBlog={handleRemoveBlog}
                updateComment={handleUpdateComment}
              />
            }
          />
          <Route path="/users/:id" element={<UserBlogs users={users} />} />
          <Route
            path="/users"
            element={
              <div>
                <h1>Users</h1>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>blogs created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users &&
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <Link to={`/users/${user.id}`}>{user.name}</Link>
                          </td>
                          <td>{user.blogs.length}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            }
          />
        </Routes>
      </BlogsContext.Provider>
    </Router>
  )
}

export default App
