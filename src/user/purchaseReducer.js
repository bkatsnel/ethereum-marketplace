const initialState = {
    loading: false,
    loaded: false,
    purchases: [],
    block: 0
  }
  
  const purchaseReducer = (state = initialState, action) => {
  
    if (action.type === 'CLEAR_PURCHASES') {
      return {
        ...initialState
      }
    }

    if (action.type === 'ADD_PURCHASE') {

      if (state.purchases.length === 0 
        || state.purchases.filter((purchase) => purchase.order === action.payload.purchase.order).length === 0) {
        
        return {
          ...state, 
          "purchases": [ ...state.purchases, action.payload.purchase ],
          "loading": false,
          "loaded": true,
          "block": action.payload.block
        }

      } else {

        return state

      }
    }

    if (action.type === 'START_LOADING_PURCHASES') {
        return {
          ...state, 
          loaded: false,
          loading: true
        }
    }

    if (action.type === 'RESET_PURCHASES_LOADED') {
        return {
          ...state, 
          loaded: false,
          loading: false
        }
    }

    if (action.type === 'END_LOADING_PURCHASES') {
        return {
          ...state, 
          loaded: true,
          loading: false
        }
    }

    if (action.type === 'SET_PURCHASES_BLOCK') {
      return {
        ...state, 
        "block": action.payload.block
      }
    }

    return state
    
  }
  
  export default purchaseReducer
  