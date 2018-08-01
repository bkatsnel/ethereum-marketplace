import React, { Component } from 'react'
import WithdrawalListContainer from '../../ui/withdrawals/WithdrawalListContainer'

class Withdrawals extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>View Your Withdrawals</h1>
            <WithdrawalListContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Withdrawals
