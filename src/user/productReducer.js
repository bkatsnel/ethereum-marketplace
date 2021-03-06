const initialState = {
    name: '',
    loading: false,
    loaded: false,
    products: [],
    block: 0,
    watch: false
  }
  
  const productReducer = (state = initialState, action) => {
  
    if (action.type === 'CLEAR_PRODUCTS') {
        return {
          ...initialState
        }
    }

    if (action.type === 'ADD_PRODUCT') {
      console.log('add product', action.payload)
      if (state.products.length === 0 
        || state.products.filter((product) => product.description === action.payload.product.description).length === 0) {

        if (state.name === action.payload.name) {

          return {
            ...state, 
            products: [ ...state.products, action.payload.product ],
            block: action.payload.block
          }

        } else {

          console.log('Did not add product for store', action.payload.name)
          return state

        }
        
      } else {

        return state

      }
    }

    if (action.type === 'SET_PRODUCTS_STORE_NAME') {
      return {
        ...state,
        name: action.payload.name
      }
    }

    if (action.type === 'CHANGE_PRODUCTS_STORE_NAME') {
      console.log('Products Store Payload', action.payload)
      return {
        ...state, 
        name: action.payload.name,
        loading: false,
        loaded: false,
        products: [],
        block: 0
      }
    }

    if (action.type === 'START_PRODUCTS_LOAD') {
        return {
          ...state, 
          loaded: false,
          loading: true
        }
    }

    if (action.type === 'RESET_PRODUCTS_LOADED') {
        return {
          ...state, 
          loaded: false,
          loading: false
        }
    }

    if (action.type === 'END_PRODUCTS_LOAD') {
        return {
          ...state, 
          loaded: true,
          loading: false
        }
    }

    if (action.type === 'START_PRODUCTS_WATCH') {
      return {
        ...state, 
        watch: true
      }
    }

    if (action.type === 'END_PRODUCTS_WATCH') {
      return {
        ...state, 
        watch: false
      }
    }

    if (action.type === 'SET_PRODUCTS_BLOCK') {
      return {
        ...state, 
        block: action.payload.block
      }
    }

    return state
    
  }
  
  export default productReducer
  