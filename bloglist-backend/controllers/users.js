const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author:1, url: 1, id: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = password ? await bcrypt.hash(password, saltRounds) : null

  password && password.length < 3 && next({
    name: 'ValidationError',
    message: 'Path `password` is shorter than the minimum allowed length (3).'
  })

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()

    response.status(201).json(savedUser)
  }
  catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter