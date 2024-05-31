const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
    user:  '6404966f01d6f943aee84582'
  }
]

beforeEach( async () => {
  await Blog.deleteMany({})
  for (let blog of initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('salasana', 10)
  const user = new User(
    {
      _id: '6404966f01d6f943aee84582',
      username: 'mmeikala',
      name: 'Matti Meikäläinen',
      passwordHash
    })

  await user.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api
    .get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('check id field', async () => {
  const response = await api
    .get('/api/blogs')
  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('a valid blog can be added', async () => {
  const token = await helper.userLogin()

  const newBlog = {
    title: 'Canonical string reduction - part 2',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 11
  }

  await api
    .post('/api/blogs')
    .set({ Authorization: 'Bearer ' + token })
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain(
    'Canonical string reduction - part 2'
  )
})

test('likes are set to 0', async () => {
  const token = await helper.userLogin()

  const newBlog = {
    title: 'Canonical string reduction - part 3',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
  }

  await api
    .post('/api/blogs')
    .set({ Authorization: 'Bearer ' + token })
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')

  const likes = response.body.map(r => r.likes)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  likes.forEach(like => expect(like).toBeDefined())
})

test('check title and url', async () => {
  const token = await helper.userLogin()

  const newBlog = {
    author: 'Edsger W. Dijkstra'
  }

  await api
    .post('/api/blogs')
    .set({ Authorization: 'Bearer ' + token })
    .send(newBlog)
    .expect(400)
})

test('delete blog', async () => {
  const token = await helper.userLogin()

  await api
    .delete('/api/blogs/5a422bc61b54a676234d17fc')
    .set({ Authorization: 'Bearer ' + token })
    .expect(204)

  const response = await api
    .get('/api/blogs')

  const ids = response.body.map(r => r.id)

  expect(response.body).toHaveLength(initialBlogs.length - 1)
  expect(ids).not.toContain('5a422bc61b54a676234d17fc')
})

test('modify blog', async () => {
  const token = await helper.userLogin()

  const blog = {
    id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 3,
  }

  await api
    .put('/api/blogs/5a422bc61b54a676234d17fc')
    .set({ Authorization: 'Bearer ' + token })
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')

  const modifiedBlog = response.body.filter(blog => blog.id === '5a422bc61b54a676234d17fc')

  expect(modifiedBlog[0].likes).toBe(3)
})

test('a blog cannot be added  if token is missing', async () => {
  const newBlog = {
    title: 'Canonical string reduction - part 2',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 11
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const response = await api
    .get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})


afterAll(async () => {
  await mongoose.connection.close()
})