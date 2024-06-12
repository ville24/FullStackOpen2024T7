import PropTypes from 'prop-types'
import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import BlogsContext from '../BlogsContext'
import { Form, Button } from 'react-bootstrap'

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
    <div className="blog">
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
          <span className="pr-3">{blog.likes} likes</span> <span> </span>
          {user && (
            <Button onClick={handleLike} className="ml-3">
              Like
            </Button>
          )}
        </p>
        <p>Added by {blog.user.name}</p>
        {user && user.username === blog.user.username && (
          <Button onClick={handleRemove} className="removebutton">
            remove
          </Button>
        )}
        <h3 className="my-3">Comments</h3>
        <Form onSubmit={handleComment}>
          <div>
            <Form.Control
              type="text"
              value={comment}
              name="title"
              onChange={({ target }) => setComment(target.value)}
              style={{maxWidth: "30em"}}
              className="float-start"
            />
            <div className="float-start mx-1">&nbsp;</div>
            <Button type="submit" id="addComment" className="float-start">
              Add comment
            </Button>
          </div>
        </Form>
        <ul className="float-start mt-3" style={{clear: "both"}}>
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
