import PropTypes from 'prop-types'

const notificationMessage = (props) => {

  notificationMessage.propTypes = {
    notificationMessage: PropTypes.string.isRequired
  }

  const notificationStyle = {
    color: 'green',
    fontSize: 20,
    padding: 5,
    marginBottom: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'green',
    borderRadius: 5,
    backgroundColor: 'lightGray'
  }
  return (
    <div style={notificationStyle} className='info'>{props.notificationMessage}</div>
  )
}
export default notificationMessage