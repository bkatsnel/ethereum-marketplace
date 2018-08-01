const initialState = {
    loading: false,
    loaded: false,
    records: [],
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

    if (action.type === 'START_LOADING_ENS') {
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

    if (action.type === 'END_LOADING_ENS') {
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
  