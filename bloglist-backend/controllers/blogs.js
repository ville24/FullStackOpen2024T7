const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})


blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const body = request.body

  try {

    const user = request.user

    if (!body.title || !body.url)
      next({
        name:'ValidationError',
        message: 'title or url missing'
      })

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ? body.likes : 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    await savedBlog.populate('user', { username: 1, name: 1, id: 1 }).execPopulate()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

  }
  catch (exception) {
    next(exception)
  }
})


blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if (user.id.toString() === blog.user.toString()) {
      await Blog.findByIdAndRemove(request.params.id, { useFindAndModify: false })
      response.status(204).end()
    }
    else {
      next({
        name:'Unauthorized',
        message: 'User has no access right to the blog'
      })
    }
  }
  catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', userExtractor, async (request, response, next) => {
  try {
    const blog = new Blog(request.body)
    blog._id = request.params.id

    const updatedBlog = await Blog
      .findByIdAndUpdate( request.params.id, blog, { new: true, overwrite: true, useFindAndModify: false } )
    await updatedBlog.populate('user', { username: 1, name: 1, id: 1 }).execPopulate()
    response.status(201).json(updatedBlog)
  }
  catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter