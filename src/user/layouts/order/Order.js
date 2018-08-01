import React, { Component } from 'react'
import OrderFormContainer from '../../ui/order/OrderFormContainer'

class Order extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Place Order</h1>
            <OrderFormContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Order
