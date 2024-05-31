import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, updateBlog, removeBlog }) => {

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    updateBlog: PropTypes.func.isRequired,
    removeBlog: PropTypes.func.isRequired
  }

  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = (event) => {
    event.preventDefault()

    updateBlog({
      id: blog.id,
      title: blog.title,
      author:blog. author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    })
  }

  const handleRemove = () => {
    if (window.confirm('Remove blog: ' + blog.title)) {
      removeBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <p>
        <span>{blog.title}</span>
        <span> </span>
        <span>{blog.author}</span>
        <button onClick={toggleVisibility} className='viewbutton'>view</button>
      </p>
      <div style={showWhenVisible} className='blogDetails'>
        <button onClick={toggleVisibility}>hide</button>
        <p>{blog.url}</p>
        <p className='likes'>{blog.likes} <button onClick={handleLike} className='likebutton'>like</button></p>
        <p>{blog.user.name}</p>
        {
          user.username === blog.user.username &&
          <button onClick={handleRemove} className='removebutton'>remove</button>
        }
      </div>
    </div>
  )
}

export default Blog