import { useParams } from 'react-router-dom'

const UserBlogs = ({users}) => {
    const id = useParams().id
    const user = users.find(u => u.id === id)
    return(
        <div>
            <h2>{user.name}</h2>
            <h3>added blogs</h3>
            <ul>
                {user.blogs.map(blog =>
                    <li key={blog.id}>{blog.title}</li>
                )}
            </ul>
        </div>
  )
}

export default UserBlogs