import { useContext } from 'react'
import BlogsContext from '../BlogsContext'

import { Link } from 'react-router-dom'

const Users = () => {
  const {
    users: [users],
  } = useContext(BlogsContext)
  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
