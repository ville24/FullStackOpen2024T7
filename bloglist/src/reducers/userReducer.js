const userReducer = (state, action) => {
    switch (action.type) {
      case 'addUser':
        return action.payload
      case 'removeUser':
        return null
      default:
        return null
    }
}

export default userReducer