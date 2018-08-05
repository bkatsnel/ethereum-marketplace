const initialState = {
    loading: false,
    loaded: false,
    stores: [],
    block: 0,
    watch: false
  }
  
  const storeReducer = (state = initialState, action) => {
  
    if (action.type === 'CLEAR_STORES') {
      return {
        ...initialState
      }
    }

    if (action.type === 'ADD_STORE') {

      if (state.stores.length === 0 
        || state.stores.filter((store) => store.name === action.payload.store.name).length === 0) {
        
        return {
          ...state, 
          "stores": [ ...state.stores, action.payload.store ],
          "loading": false,
          "loaded": true,
          "block": action.payload.block
        }

      } else {

        return state

      }
    }

    if (action.type === 'UPDATE_STORE_BALANCE') {
       console.log("update store balance", state.stores)
       let newStores = state.stores.map((store) => store.name === action.payload.name && store.funds > 0 ? 
          {...store, funds: store.funds - action.payload.withdrawal} : store
       )
       console.log("update store balance", newStores)
       return {
         ...state,
         stores: [ ...newStores ]
       }
    }

    if (action.type === 'START_STORES_LOAD') {
        return {
          ...state, 
          loaded: false,
          loading: true
        }
    }

    if (action.type === 'RESET_STORES_LOADED') {
        return {
          ...state, 
          loaded: false,
          loading: false
        }
    }

    if (action.type === 'END_STORES_LOAD') {
        return {
          ...state, 
          loaded: true,
          loading: false
        }
    }

    if (action.type === 'SET_STORES_BLOCK') {
      return {
        ...state, 
        "block": action.payload.block
      }
    }

    if (action.type === 'START_STORES_WATCH') {
      return {
        ...state, 
        watch: true
      }
    }

    if (action.type === 'END_STORES_WATCH') {
      return {
        ...state, 
        watch: false
      }
    }

    return state
    
  }
  
  export default storeReducer
  