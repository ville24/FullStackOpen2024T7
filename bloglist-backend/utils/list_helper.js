const _ = require('lodash')

const dummy = () => {
  return(1)
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  return blogs.reduce((favouriteBlog, blog) =>
    favouriteBlog.likes > blog.likes
      ? favouriteBlog
      : blog
  , {})
}

const mostBlogs = blogs => {
  const authors = []
  _.forEach(_.countBy(blogs, (blog) => blog.author), (value, key) => {authors.push( { 'author':key, 'blogs':value } ) })
  return authors.length === 0
    ? {}
    : _.maxBy(authors, 'blogs')
}

const mostLikes = blogs => {
  const authors = []
  _.forEach(_.groupBy(blogs, (blog) => blog.author), (value, key) => {
    const likes = value.reduce((sum, value) => sum + value.likes, 0)
    authors.push( { 'author':key, 'likes':likes } )
  })

  return authors.length === 0
    ? {}
    : _.maxBy(authors, 'likes')
}

module.exports = {
  dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}