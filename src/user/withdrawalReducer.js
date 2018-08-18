const initialState = {
    loading: false,
    loaded: false,
    withdrawals: [],
    block: 0
  }
  
  const withdrawalReducer = (state = initialState, action) => {
  
    if (action.type === 'CLEAR_WITHDRAWALS') {
      return {
        ...initialState
      }
    }

    if (action.type === 'ADD_WITHDRAWAL') {

      if (state.withdrawals.length === 0 
        || state.withdrawals.filter((withdrawal) => withdrawal.name === action.payload.withdrawal.name).length === 0) {
        
        return {
          ...state, 
          "withdrawals": [ ...state.withdrawals, action.payload.withdrawal ],
          "loading": false,
          "loaded": true,
          "block": action.payload.block
        }

      } else {

        return state

      }
    }

    if (action.type === 'START_WITHDRAWALS_LOAD') {
        return {
          ...state, 
          loaded: false,
          loading: true
        }
    }

    if (action.type === 'RESET_WITHDRAWALS_LOADED') {
        return {
          ...state, 
          loaded: false,
          loading: false
        }
    }

    if (action.type === 'END_WITHDRAWALS_LOAD') {
        return {
          ...state, 
          loaded: true,
          loading: false
        }
    }

    if (action.type === 'SET_WITHDRAWALS_BLOCK') {
      return {
        ...state, 
        "block": action.payload.block
      }
    }

    return state
    
  }
  
  export default withdrawalReducer
  