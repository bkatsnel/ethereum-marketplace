import React, { Component } from 'react'
import EnsAddressesContainer from '../../ui/ens/EnsAddressesContainer'

class EnsAddressses extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <br />
            <h1>Test Network ENS Registered Addresses</h1>
            <EnsAddressesContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default EnsAddressses
