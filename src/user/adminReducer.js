const initialState = {
    admins: [],
    loaded: false,
    loading: false,
    block: 0,
    watch: false
  }
  
  const adminReducer = (state = initialState, action) => {
  
    if (action.type === 'CLEAR_ADMINISTRATORS') {
       return {
         ...initialState
       }

    }

    if (action.type === 'ADD_ADMINISTRATOR') {

      if (state.admins.length === 0 
         || state.admins.filter((admin) => admin.id === action.payload.admin.id).length === 0) {

        return {
          ...state, 
          "admins": [ ...state.admins, action.payload.admin ],
          "block": action.payload.block
        }
        
      } else {

        return state

      }

    }

    if (action.type === 'RESET_ADMINISTRATOR_LOADED') {
        return {
          ...state, 
          "loading": false,
          "loaded": false
        }
    }

    if (action.type === 'START_ADMINISTRATOR_LOAD') {
        return {
          ...state, 
          "loaded": false,
          "loading": true
        }
    }

    if (action.type === 'START_ADMINISTRATOR_WATCH') {
      return {
        ...state, 
        "watch": true
      }
    }

    if (action.type === 'END_ADMINISTRATOR_WATCH') {
      return {
        ...state, 
        "watch": false
      }
    }

    if (action.type === 'END_ADMINISTRATOR_LOAD') {
        return {
          ...state, 
          "loaded": true,
          "loading": false
        }
    }

    if (action.type === 'SET_ADMINISTRATOR_BLOCK') {
        return {
          ...state, 
            "block": action.payload.block
        }
    }

    return state

  }
  
  export default adminReducer
  