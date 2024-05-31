const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const userLogin = async() => {
  const newUser = {
    username: 'mmeikala',
    password: 'salasana',
  }

  const res = await api
    .post('/api/login')
    .send(newUser)

  const token = res.body.token

  return [token]
}
module.exports = {
  usersInDb,
  userLogin
}