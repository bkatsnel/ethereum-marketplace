import React, { Component } from 'react'
import StoresFormContainer from '../../ui/stores/StoresFormContainer'

class Stores extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Manage Stores</h1>
            <StoresFormContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Stores
