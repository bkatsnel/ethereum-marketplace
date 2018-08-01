import React, { Component } from 'react'
import PaymentFormContainer from '../../ui/payment/PaymentFormContainer'

class Payment extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Make Withdrawal</h1>
            <PaymentFormContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Payment
