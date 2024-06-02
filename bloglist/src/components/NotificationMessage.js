import { useContext } from 'react'
import BlogsContext from '../BlogsContext'

const NotificationMessage = () => {
  const [notificationMessage] = useContext(BlogsContext)

  const notificationStyle = {
    color: 'green',
    fontSize: 20,
    padding: 5,
    marginBottom: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'green',
    borderRadius: 5,
    backgroundColor: 'lightGray',
  }
  return (
    <div style={notificationStyle} className="info">
      {notificationMessage}
    </div>
  )
}
export default NotificationMessage
