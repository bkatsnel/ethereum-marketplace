const initialState = {
    loading: false,
    loaded: false,
    owners: [],
    block: 0,
    // Store Name For Withdrawal
    store: '',
    balance: 0,
    watch: false
  }
  
  const ownerReducer = (state = initialState, action) => {

    if (action.type === 'CLEAR_OWNERS') {
        return {
          ...initialState
        }
    }
  
    if (action.type === 'ADD_OWNER') {

      if (state.owners.length === 0 
        || state.owners.filter((owner) => owner.id === action.payload.owner.id).length === 0) {
       
        return {
          ...state, 
          "owners": [ ...state.owners, action.payload.owner ],
          "block": action.payload.block
        }

      } else {

        return state

      }
    }
  
    if (action.type === 'INIT_OWNERS') {
        let newState =  {
          ...state, 
          "owners": [ ...action.payload ],
          loaded: true,
          loading: false
        }
        return newState
    }

    if (action.type === 'START_LOADING_OWNERS') {
        return {
          ...state, 
          loaded: false,
          loading: true
        }
    }

    if (action.type === 'RESET_OWNERS_LOADED') {
        return {
          ...state, 
          loaded: false,
          loading: false
        }
    }

    if (action.type === 'END_LOADING_OWNERS') {
        return {
          ...state, 
          loaded: true,
          loading: false
        }
    }

    if (action.type === 'SET_OWNERS_BLOCK') {
      return {
        ...state,
        "block": action.payload.block
      }
    }

    if (action.type === 'SET_OWNER_STORE') {
      return {
        ...state,
        store: action.payload.store,
        balance: action.payload.funds
      }
    }

    if (action.type === 'START_WATCHING_OWNERS') {
      return {
        ...state,
        watch: true
      }
    }

    if (action.type === 'END_WATCHING_OWNERS') {
      return {
        ...state,
        watch: false
      }
    }

    return state
    
  }
  
  export default ownerReducer
  