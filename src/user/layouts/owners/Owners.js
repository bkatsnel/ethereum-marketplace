import React, { Component } from 'react'
import OwnersFormContainer from '../../ui/owners/OwnersFormContainer'

class Owners extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Add Owners</h1>
            <OwnersFormContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Owners
