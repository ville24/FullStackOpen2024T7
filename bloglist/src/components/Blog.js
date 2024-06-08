import PropTypes from 'prop-types'
import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import BlogsContext from '../BlogsContext'

const Blog = ({ updateBlog, removeBlog, updateComment }) => {
  Blog.propTypes = {
    updateBlog: PropTypes.func.isRequired,
    removeBlog: PropTypes.func.isRequired,
    updateComment: PropTypes.func.isRequired,
  }
  const {
    user: [user],
    blogs: [blogs],
  } = useContext(BlogsContext)

  const [comment, setComment] = useState('')
  const id = useParams().id

  const blog = blogs && blogs.find((b) => b.id === id)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = (event) => {
    event.preventDefault()

    updateBlog({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
      comments: blog.comments,
    })
  }

  const handleRemove = () => {
    if (window.confirm('Remove blog: ' + blog.title)) {
      removeBlog(blog.id)
    }
  }

  const handleComment = (event) => {
    event.preventDefault()
    updateComment({ id: blog.id, comment: [comment] })
  }

  return blog ? (
    <div style={blogStyle} className="blog">
      <h2>
        <span>{blog.title}</span>
        <span> </span>
        <span>{blog.author}</span>
      </h2>
      <div>
        <p>
          <a href={blog.url}>{blog.url}</a>
        </p>
        <p className="likes">
          {blog.likes} likes
          {user && (
            <button onClick={handleLike} className="likebutton">
              like
            </button>
          )}
        </p>
        <p>Added by {blog.user.name}</p>
        {user && user.username === blog.user.username && (
          <button onClick={handleRemove} className="removebutton">
            remove
          </button>
        )}
        <h3>Comments</h3>
        <form onSubmit={handleComment}>
          <div>
            <input
              type="text"
              value={comment}
              name="title"
              onChange={({ target }) => setComment(target.value)}
            />
            <button type="submit" id="addComment">
              Add comment
            </button>
          </div>
        </form>
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <Navigate replace={true} to="/blogs" />
  )
}

export default Blog
