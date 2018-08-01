import React, { Component } from 'react'
import AdministratorsFormContainer from '../../ui/administrators/AdministratorsContainer'

class Administrators extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Add Administrators</h1>
            <AdministratorsFormContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Administrators
