const initialState = {
    loading: false,
    loaded: false,
    records: [],
    name: "",
    address: "",
    block: 0
  }
  
  const ensReducer = (state = initialState, action) => {
  
    if (action.type === 'CLEAR_ENS') {
      return {
        ...initialState
      }
    }

    if (action.type === 'ADD_ENS_RECORD') {

      if (state.records.length === 0 
        || state.records.filter((record) => record.node === action.payload.record.node).length === 0) {
        
        return {
          ...state, 
          "records": [ ...state.records, action.payload.record ],
          "loading": false,
          "loaded": true,
          "block": action.payload.block
        }

      } else {

        return state

      }
    }

    if (action.type === 'ADD_ENS_DOMAIN') {
      return {
        ...state, 
        name: action.payload.name,
        address: action.payload.address
      }
    }

    if (action.type === 'START_ENS_LOAD') {
        return {
          ...state, 
          loaded: false,
          loading: true
        }
    }

    if (action.type === 'RESET_ENS_LOADED') {
        return {
          ...state, 
          loaded: false,
          loading: false
        }
    }

    if (action.type === 'END_ENS_LOAD') {
        return {
          ...state, 
          loaded: true,
          loading: false
        }
    }

    if (action.type === 'SET_ENS_BLOCK') {
      return {
        ...state, 
        "block": action.payload.block
      }
    }

    return state
    
  }
  
  export default ensReducer
  