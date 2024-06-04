import { useContext } from 'react'
import BlogsContext from '../BlogsContext'

const ErrorMessage = () => {
  const {error: [errorMessage, errorMessageDispatch]} = useContext(BlogsContext)

  const errorStyle = {
    color: 'red',
    fontSize: 20,
    padding: 5,
    marginBottom: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'red',
    borderRadius: 5,
    backgroundColor: 'lightGray',
  }
  return (
    <div style={errorStyle} className="error">
      {errorMessage}
    </div>
  )
}
export default ErrorMessage
