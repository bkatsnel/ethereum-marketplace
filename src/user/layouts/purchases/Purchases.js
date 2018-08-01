import React, { Component } from 'react'
import PurchaseListContainer from '../../ui/purchases/PurchaseListContainer'

class Purchases extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>View Your Orders</h1>
            <PurchaseListContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Purchases
