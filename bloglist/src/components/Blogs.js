import { useContext } from 'react'
import BlogsContext from '../BlogsContext'
import { Link } from 'react-router-dom'

const Blogs = () => {
  const {
    blogs: [blogs],
  } = useContext(BlogsContext)

  return (
    <div>
      {blogs &&
        blogs.map((blog) => (
          <div key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </div>
        ))}
    </div>
  )
}

export default Blogs
