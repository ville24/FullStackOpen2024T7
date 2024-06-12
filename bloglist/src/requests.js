import axios from 'axios'

//const baseUrl = 'http://localhost:3003'
const baseUrl = 'https://didactic-train-wx6prvp5vp7c5569-3000.app.github.dev'

const setToken = (newToken) => {
  return `Bearer ${newToken}`
}

const setConfig = (obj) => {
  return {
    headers: {
      Authorization: setToken(obj.user.token),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers':
        'Origin, Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, locale',
      'Access-Control-Allow-Methods': 'GET, POST',
    },
  }
}

export const login = async (credentials) => {
  const response = await axios.post(baseUrl + '/api/login', credentials)
  return response.data
}

export const getBlogs = () =>
  axios.get(baseUrl + '/api/blogs').then((res) => res.data)

export const createBlog = async (obj) => {
  const config = setConfig(obj)
  const response = await axios.post(baseUrl + '/api/blogs', obj.newBlog, config)
  return response.data
}

export const updateBlog = async (obj) => {
  const id = obj.updateBlog.id
  delete obj.updateBlog.id
  const config = setConfig(obj)
  const response = await axios.put(
    baseUrl + '/api/blogs' + '/' + id,
    obj.updateBlog,
    config,
  )
  return response.data
}

export const removeBlog = async (obj) => {
  const config = setConfig(obj)
  await axios.delete(baseUrl + '/api/blogs' + '/' + obj.id, config)
}

export const getUsers = async () => {
  const response = axios.get(baseUrl + '/api/users')
  return (await response).data
}

export const updateComment = async (obj) => {
  const id = obj.id
  const response = await axios.post(
    baseUrl + '/api/blogs/' + id + '/comments',
    { comments: obj.comment },
  )
  return response.data
}
