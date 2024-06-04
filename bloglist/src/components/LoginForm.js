import { useState, useContext } from 'react'
import { useMutation } from '@tanstack/react-query'
import BlogsContext from '../BlogsContext'
import { login } from '../requests'

const LoginForm = () => {
  const {
    notification: [notificationMessage, notificationDispatch], 
    error: [errorMessage, errorMessageDispatch],
    user: [user, userDispatch]
  } = useContext(BlogsContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      userDispatch({
        type: 'addUser',
        payload: user,
      })
      setUsername('')
      setPassword('')
      notificationDispatch({
        type: 'notificationShow',
        payload: `User ${user.name} logged in`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'notificationHide', payload: null })
      }, 2000)
    },
    onError: () => {
        errorMessageDispatch({
          type: 'errorMessageShow',
          payload: 'wrong username or password',
        })
        setTimeout(() => {
          errorMessageDispatch({ type: 'errorMessageHide', payload: null })
        }, 2000)
      }
  })

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    loginMutation.mutate({ username, password, })
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            id="username"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            id="password"
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit" id="login-button">
          login
        </button>
      </form>
    </div>
  )
}

export default LoginForm
