import { useContext } from 'react'
import BlogsContext from '../BlogsContext'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Blogs = () => {
  const {
    blogs: [blogs],
  } = useContext(BlogsContext)

  return (
    <Table>
      {blogs &&
        blogs.map((blog) => (
          <tbody key={blog.id}>
            <tr>
              <td>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </td>
            </tr>
          </tbody>
        ))}
    </Table>
  )
}

export default Blogs
