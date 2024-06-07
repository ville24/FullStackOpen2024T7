import PropTypes from 'prop-types'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const Blog = ({ blogs, user, updateBlog, removeBlog, updateComment }) => {
  Blog.propTypes = {
    blogs: PropTypes.array,
    user: PropTypes.object,
    updateBlog: PropTypes.func.isRequired,
    removeBlog: PropTypes.func.isRequired,
  }
  const [comment, setComment] = useState('')
  const navigate = useNavigate()
  const id = useParams().id

  const blog = blogs && blogs.find((b) => b.id === id)
  !blog && navigate('/blogs')

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

  if (blog) {
    return (
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
            {blog.comments.map((comment) => (
              <li key={comment}>{comment}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}

export default Blog
