import { useContext } from 'react'
import BlogsContext from '../BlogsContext'
import { Alert } from 'react-bootstrap'

const ErrorMessage = () => {
  const {error: [errorMessage, errorMessageDispatch]} = useContext(BlogsContext)

  return (
    <Alert variant="danger">
      {errorMessage}
    </Alert>
  )
}
export default ErrorMessage
