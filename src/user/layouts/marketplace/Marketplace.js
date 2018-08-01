import React, { Component } from 'react'
import ShopListContainer from '../../ui/marketplace/ShopListContainer'

class Marketplace extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <br />
            <h1>Double Click to Visit Our Great Shops!</h1>
            <ShopListContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Marketplace
