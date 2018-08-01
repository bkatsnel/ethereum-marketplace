import React, { Component } from 'react'

class SignUpForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      homeAddress: ''
    }
  }

  onInputChangeName(event) {
    this.setState({ name: event.target.value })
  }

  onInputChangeAddress(event) {
    this.setState({ homeAddress: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()

    if (this.state.name.length < 2)
    {
      return alert('Please fill in your name.')
    }

    this.props.onSignUpFormSubmit(this.state.name, this.state.homeAddress)
  }

  render() {
    return(
      <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit.bind(this)}>
        <fieldset>
          <label htmlFor="name">Customer Information</label>
          <br />
          <input id="name" type="text" value={this.state.name} onChange={this.onInputChangeName.bind(this)} placeholder="Name" />
          <input id="address" type="text" value={this.state.homeAddress} onChange={this.onInputChangeAddress.bind(this)} placeholder="Address" />
          <span className="pure-form-message">These are required fields.</span>

          <br />

          <button type="submit" className="pure-button pure-button-primary">Sign Up</button>
        </fieldset>
      </form>
    )
  }
}

export default SignUpForm
