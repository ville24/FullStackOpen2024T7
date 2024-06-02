const errorMessageReducer = (state, action) => {
    switch (action.type) {
      case 'errorMessageShow':
        return action.payload
      case 'errorMessageHide':
        return null
      default:
        return null
    }
}

export default errorMessageReducer