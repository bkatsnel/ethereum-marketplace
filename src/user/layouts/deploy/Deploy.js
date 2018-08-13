import React, { Component } from 'react'
import DeployFormContainer from '../../ui/deploy/DeployFormContainer'

class ContractDeployment extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <br />
            <h1>Contact Deployments Status</h1>
            <DeployFormContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default ContractDeployment
