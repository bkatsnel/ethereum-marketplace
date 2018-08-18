import { browserHistory } from 'react-router'

export const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
export const CLEAR_ADMINISTRATORS = 'CLEAR_ADMINISTRATORS'
export const CLEAR_OWNERS = 'CLEAR_OWNERS'
export const CLEAR_STORES = 'CLEAR_STORES'
export const CLEAR_PRODUCTS = 'CLEAR_PRODUCTS'
export const CLEAR_PURCHASES = 'CLEAR_PURCHASES'
export const CLEAR_ENS = 'CLEAR_ENS'
export const CLEAR_PRICE = 'CLEAR_PRICE'
export const CLEAR_WITHDRAWALS = 'CLEAR_WITHDRAWALS'
export const CLEAR_WEB3_CONTRACTS = 'CLEAR_WEB3_CONTRACTS'

function userLoggedOut(user) {
  return {
    type: USER_LOGGED_OUT,
    payload: user
  }
}

function clearAdministrators() {
  return {
    type: CLEAR_ADMINISTRATORS
  }
}

function clearOwners() {
  return {
    type: CLEAR_OWNERS
  }
}

function clearStores() {
  return {
    type: CLEAR_STORES
  }
}

function clearProducts() {
  return {
    type: CLEAR_PRODUCTS
  }
}

function clearPurchases() {
  return {
    type: CLEAR_PURCHASES
  }
}

function clearWithdrawals() {
  return {
    type: CLEAR_WITHDRAWALS
  }
}

function clearEns() {
  return {
    type: CLEAR_ENS
  }
}

function clearPrice() {
  return {
    type: CLEAR_PRICE
  }
}

function clearWeb3Contracts() {
  return {
    type: CLEAR_WEB3_CONTRACTS
  }
}

export function logoutUser() {
  return function(dispatch) {
    // Logout user.
    dispatch(clearAdministrators())
    dispatch(clearOwners())
    dispatch(clearStores())
    dispatch(clearProducts())
    dispatch(clearPurchases())
    dispatch(clearWithdrawals())
    dispatch(clearEns())
    dispatch(clearPrice())
    dispatch(clearWeb3Contracts())
    dispatch(userLoggedOut())
    // Redirect home.
    return browserHistory.push('/')
  }
}
