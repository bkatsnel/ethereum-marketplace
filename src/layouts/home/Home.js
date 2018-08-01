import React, { Component } from 'react'

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Welcome to Online Marketplace!</h1>
            <p>Please, login to start shopping!!!.</p>
            <h2>Not yet a Customer?</h2>
            <p>Please, sign up and start shopping now!!!.</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
