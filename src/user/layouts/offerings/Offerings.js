import React, { Component } from 'react'
import StoreProductListContainer from '../../ui/offerings/StoreProductListContainer'

class Offerings extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <br />
            <h1>We Offer Great Products!</h1>
            <StoreProductListContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Offerings
