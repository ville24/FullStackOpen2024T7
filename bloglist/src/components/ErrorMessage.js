import PropTypes from 'prop-types'

const ErrorMessage = (props) => {

  ErrorMessage.propTypes = {
    errorMessage: PropTypes.string.isRequired
  }

  const errorStyle = {
    color: 'red',
    fontSize: 20,
    padding: 5,
    marginBottom: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'red',
    borderRadius: 5,
    backgroundColor: 'lightGray'
  }
  return (
    <div style={errorStyle} className='error'>{props.errorMessage}</div>
  )
}
export default ErrorMessage