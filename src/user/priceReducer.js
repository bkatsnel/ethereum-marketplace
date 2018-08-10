const initialState = {
    loading: false,
    loaded: false,
    balance: 0,
    usd: 0,
    owner: '',
    msg: '',
    block: 0
  }
  
  const priceReducer = (state = initialState, action) => {
  
    console.log('Price Reducer', action)

    if (action.type === 'CLEAR_PRICE') {
      return {
        ...initialState
      }
    }

    if (action.type === 'UPDATE_PRICE') {
      return {
        ...state,
        ...action.payload
      }
    }

    if (action.type === 'UPDATE_BALANCE') {
      return {
        ...state,
        ...action.payload
      }
    }

    if (action.type === 'UPDATE_PRICE_MSG') {
        return {
          ...state,
          ...action.payload
        }
    }

    if (action.type === 'SET_PRICE_BLOCK') {
        return {
          ...state,
          "block": action.payload.block
        }
    }

    if (action.type === 'START_PRICE_LOAD') {
        return {
          ...state,
          loading: true
        }
    }

    if (action.type === 'END_PRICE_LOAD') {
        return {
          ...state,
          loading: false,
          loaded: true
        }
    }

    return state
  }
  
  export default priceReducer
  