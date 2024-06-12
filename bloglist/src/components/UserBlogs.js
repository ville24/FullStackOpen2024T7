import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import BlogsContext from '../BlogsContext'
import { ListGroup } from 'react-bootstrap'

const UserBlogs = () => {
  const {
    users: [users],
  } = useContext(BlogsContext)

  const id = useParams().id
  const user = users.find((u) => u.id === id)
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ListGroup>
        {user.blogs.map((blog) => (
          <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default UserBlogs
