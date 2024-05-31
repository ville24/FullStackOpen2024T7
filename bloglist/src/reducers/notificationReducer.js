const notificationReducer = (state, action) => {
    switch (action.type) {
      case 'notificationShow':
        return action.payload
      case 'notificationHide':
        return null
      default:
        return null
    }
}

export default notificationReducer