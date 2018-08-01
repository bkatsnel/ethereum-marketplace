import React, { Component } from 'react'

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Dashboard</h1>
            <p><strong>Welcome to Online Marketplace Powered by Blockchain, {this.props.authData.name}!</strong></p>
            { this.props.authData.type === "admin" ? <p>Please, proceed to perform administrative actions</p> :
              this.props.authData.type === "owner" ? <p>Please, proceed to manage your stores and products.</p> :
                                                     <p>The best shopping universe powered by blockchain.</p> 
            }
          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard
