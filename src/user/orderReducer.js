const initialState = {
    name: null,
    id: null,
    quantity: null,
    price: null,
    description: null,
    available: null
  }
  
  const userReducer = (state = initialState, action) => {
    if (action.type === 'PLACE_ORDER') {
      return {
        ...state,
        quantity: action.payload.quantity
      }
    }

    if (action.type === 'DESCRIBE_ORDER') {
        console.log("Order Reducer Describe", action.payload)
        return {
          ...state,
          ...action.payload
        }
    }
  
    return state
  }
  
  export default userReducer
  