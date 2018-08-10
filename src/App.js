import React, { Component } from 'react'
import { Link } from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAdmin, VisibleOnlyOwner, VisibleOnlyCustomer } from './util/wrappers.js'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

// Styles
import './user/ui/marketplace/Shop-Pure.css'
import './user/ui/marketplace/Shop-Fonts.css'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './css/pure-table.css'
import './App.css'

class App extends Component {

  render() {

    const OnlyAdminLinks = VisibleOnlyAdmin(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">Dashboard</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/administrators" className="pure-menu-link">Administrators</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/owners" className="pure-menu-link">Owners</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/ipfsstatus" className="pure-menu-link">IPFS</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/ensaddresses" className="pure-menu-link">ENS</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/price" className="pure-menu-link">Price</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlyOwnerLinks = VisibleOnlyOwner(() => 
      <span>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">Dashboard</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/stores" className="pure-menu-link">Stores</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/products" className="pure-menu-link">Products</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/withdrawals" className="pure-menu-link">Withdrawals</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlyCustomerinks = VisibleOnlyCustomer(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/marketplace" className="pure-menu-link">Marketplace</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">Dashboard</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/purchases" className="pure-menu-link">Orders</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/signup" className="pure-menu-link">Sign Up</Link>
        </li>
        <LoginButtonContainer />
      </span>
    )

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <ul className="pure-menu-list navbar-right">
            <OnlyGuestLinks />
            <OnlyAdminLinks />
            <OnlyOwnerLinks />
            <OnlyCustomerinks />
          </ul>
          <Link to="/" className="pure-menu-heading pure-menu-link">Home</Link>
        </nav>

        {this.props.children}
      </div>
    );
  }
}

export default App
