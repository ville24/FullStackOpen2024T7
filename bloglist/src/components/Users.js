import { useContext } from 'react'
import BlogsContext from '../BlogsContext'
import { Table } from 'react-bootstrap'

import { Link } from 'react-router-dom'

const Users = () => {
  const {
    users: [users],
  } = useContext(BlogsContext)
  return (
    <div>
      <h1>Users</h1>
      <Table>
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs created</th>
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
      </Table>
    </div>
  )
}

export default Users
