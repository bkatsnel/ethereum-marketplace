import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user/userReducer'
import ownerReducer from './user/ownerReducer'
import adminReducer from './user/adminReducer'
import storeReducer from './user/storeReducer'
import productReducer from './user/productReducer'
import orderReducer from './user/orderReducer'
import purchaseReducer from './user/purchaseReducer'
import withdrawalReducer from './user/withdrawalReducer'
import ensReducer from './user/ensReducer'
import web3Reducer from './util/web3/web3Reducer'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  admins: adminReducer,
  owners: ownerReducer,
  stores: storeReducer,
  order: orderReducer,
  products: productReducer,
  purchases: purchaseReducer,
  withdrawals: withdrawalReducer,
  ens: ensReducer,
  web3: web3Reducer
})

export default reducer
