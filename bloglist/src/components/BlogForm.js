import { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired,
  }

  const handleSaveNew = async (event) => {
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div style={{maxWidth: "40em"}}>
      <h2>Create new</h2>
      <Form onSubmit={handleSaveNew}>
        <Form.Group>
          <Form.Label>Title:</Form.Label>
          <Form.Control
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Author:</Form.Label>
          <Form.Control
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>URL:</Form.Label>
          <Form.Control
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </Form.Group>
        <Button type="submit" id="createblog" className="my-3 float-start">
          Create
        </Button>
      </Form>
    </div>
  )
}

export default BlogForm
