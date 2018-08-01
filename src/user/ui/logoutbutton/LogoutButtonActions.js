import { browserHistory } from 'react-router'

export const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
export const CLEAR_ADMINISTRATORS = 'CLEAR_ADMINISTRATORS'
export const CLEAR_OWNERS = 'CLEAR_OWNERS'
export const CLEAR_STORES = 'CLEAR_STORES'
export const CLEAR_PRODUCTS = 'CLEAR_PRODUCTS'
export const CLEAR_PURCHASES = 'CLEAR_PURCHASES'
export const CLEAR_ENS = 'CLEAR_ENS'

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

function clearEns() {
  return {
    type: CLEAR_ENS
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
    dispatch(clearEns())
    dispatch(userLoggedOut())
    // Redirect home.
    return browserHistory.push('/')
  }
}
