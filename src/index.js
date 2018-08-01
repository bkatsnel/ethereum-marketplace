import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { UserIsAuthenticated, UserIsNotAuthenticated, UserIsAdministrator, UserIsOwner, UserIsCustomer } from './util/wrappers.js'
import getWeb3 from './util/web3/getWeb3'

// Layouts
import App from './App'
import Home from './layouts/home/Home'
import Dashboard from './layouts/dashboard/Dashboard'
import SignUp from './user/layouts/signup/SignUp'
import Profile from './user/layouts/profile/Profile'
import Administrators from './user/layouts/administrators/Administrators'
import Owners from './user/layouts/owners/Owners'
import Stores from './user/layouts/stores/Stores'
import Products from './user/layouts/products/Products'
import Marketplace from './user/layouts/marketplace/Marketplace'
import Offerings from './user/layouts/offerings/Offerings'
import Order from './user/layouts/order/Order'
import Purchases from './user/layouts/purchases/Purchases'
import Withdrawals from './user/layouts/withdrawals/Withdrawals'
import Payment from './user/layouts/payment/Payment'
import ensAddresses from './user/layouts/ens/ensAddresses'
import IpfsStatus from './layouts/ipfs/IpfsStatus'

// Redux Store
import store from './store'

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store)

// Expose Store For Debugging

window.store = store

// Initialize web3 and set in Redux.
getWeb3
.then(results => {
  console.log('Web3 initialized!')
})
.catch(() => {
  console.log('Error in web3 initialization.')
})

render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="dashboard" component={UserIsAuthenticated(Dashboard)} />
          <Route path="signup" component={UserIsNotAuthenticated(SignUp)} />
          <Route path="profile" component={UserIsAuthenticated(Profile)} />
          <Route path="administrators" component={UserIsAdministrator(Administrators)} />
          <Route path="owners" component={UserIsAdministrator(Owners)} />
          <Route path="ipfsstatus" component={UserIsAdministrator(IpfsStatus)} />
          <Route path="ensaddresses" component={UserIsAdministrator(ensAddresses)} />
          <Route path="stores" component={UserIsOwner(Stores)} />
          <Route path="products" component={UserIsOwner(Products)} />
          <Route path="withdrawals" component={UserIsOwner(Withdrawals)} />
          <Route path="payment" component={UserIsOwner(Payment)} />
          <Route path="marketplace" component={UserIsCustomer(Marketplace)} />
          <Route path="offerings" component={UserIsCustomer(Offerings)} />
          <Route path="order" component={UserIsCustomer(Order)} />
          <Route path="purchases" component={UserIsCustomer(Purchases)} />
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)
