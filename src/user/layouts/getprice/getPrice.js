import React, { Component } from 'react'
import PriceFormContainer from '../../ui/getprice/PriceFormContainer'

class GetPrice extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <br />
            <h1>Test Network Oraclize Query via Coinbase</h1>
            <PriceFormContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default GetPrice
