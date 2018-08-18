const initialState = {
  web3Instance: null,
  manager: "",
  market: "",
  storage: "",
  owners: "",
  stores: "",
  customers: "",
  loading: false,
  block: 0
}

const web3Reducer = (state = initialState, action) => {

  if (action.type === 'WEB3_INITIALIZED') {
    return {
      ...state,
      ...action.payload
    }
  }

  if (action.type === 'CLEAR_WEB3_CONTRACTS') {
    return {
      ...state,
      manager: "",
      market: "",
      storage: "",
      loading: false
    }
  }

  if (action.type === 'WEB3_UPDATE') {
    return {
      ...state,
      ...action.payload
    }
  }

  if (action.type === 'WEB3_START_LOADING') {
    return {
      ...state,
      loading: true
    }
  }

  if (action.type === 'WEB3_END_LOADING') {
    return {
      ...state,
      loading: false
    }
  }

  return state
}

export default web3Reducer
