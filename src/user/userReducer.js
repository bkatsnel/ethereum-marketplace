const initialState = {
  id: null,
  name: null,
  type: null,
  address: null,
  balance: null,
  home: null,
  orders: null,
  withdrawals: null,
  ipfs: null
}

const userReducer = (state = initialState, action) => {
  if (action.type === 'USER_LOGGED_IN' || action.type === 'USER_UPDATED') {
    return {
      ...state,
      ...action.payload
    }
  }

  if (action.type === 'USER_LOGGED_OUT') {
    return{
      ...initialState
    }
  }

  return state
}

export default userReducer
