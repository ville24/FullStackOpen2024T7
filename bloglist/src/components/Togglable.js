import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const Togglable = forwardRef((props, ref) => {
  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button
          onClick={toggleVisibility}
          id={props.buttonLabel.replace(' ', '')}
          className="my-3"
        >
          {props.buttonLabel}
        </Button>
      </div>
      <span style={showWhenVisible}>
        {props.children}
        <Button variant="secondary" onClick={toggleVisibility} className="m-3 float-start">Cancel</Button>
      </span>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
