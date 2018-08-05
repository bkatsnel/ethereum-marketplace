const initialState = {
    loading: false,
    loaded: false,
    purchases: [],
    block: 0,
    watch: false,
    refresh: false
  }
  
  const purchaseReducer = (state = initialState, action) => {
  
    console.log("Purchases Reducer Action", action.type)

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

    if (action.type === 'ADD_PURCHASE_AND_WATCH') {

      if (state.purchases.length === 0 
        || state.purchases.filter((purchase) => purchase.order === action.payload.purchase.order).length === 0) {
        
        return {
          ...state, 
          "purchases": [ ...state.purchases, action.payload.purchase ],
          "loading": false,
          "loaded": true,
          "block": action.payload.block,
          "watch": false
        }

      } else {

        return state

      }
    }

    if (action.type === 'START_PURCHASES_LOAD') {
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

    if (action.type === 'END_PURCHASES_LOAD') {
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

    if (action.type === 'START_PURCHASES_WATCH') {
      return {
        ...state, 
        watch: true,
        refresh: false
      }
    }
   
    if (action.type === 'END_PURCHASES_WATCH') {
      return {
        ...state, 
        watch: false
      }
    }

    if (action.type === 'SET_PURCHASES_REFRESH') {
      return {
        ...state, 
        refresh: true
      }
    }

    if (action.type === 'RESET_PURCHASES_REFRESH') {
      return {
        ...state, 
        refresh: false
      }
    }

    return state
    
  }
  
  export default purchaseReducer
  