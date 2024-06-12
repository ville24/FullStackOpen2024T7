import { useContext } from 'react'
import BlogsContext from '../BlogsContext'
import { Alert } from 'react-bootstrap'

const NotificationMessage = () => {
  const {notification: [notificationMessage, notificationDispatch]} = useContext(BlogsContext)

  return (
    <Alert variant="success">
      {notificationMessage}
    </Alert>
  )
}
export default NotificationMessage
