import React from 'react'
import { browserHistory } from 'react-router'

const PaymentForm = ({name, id, balance, withdrawals, store, store_balance, onWithdraw=f=>f}) => {

  let _quantity
  console.log('Payment Form Entry')

  const submit = e => {
    e.preventDefault()

    onWithdraw(store)

    var currentLocation = browserHistory.getCurrentLocation()

    if ('redirect' in currentLocation.query) {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
    }

    browserHistory.push('/withdrawals')

  }

  return(
    <div>
      <h3 htmlFor="store">{store} Balance Withdrawal Form - Please, Review And Submit</h3>
      <form className="pure-form pure-form-stacked" onSubmit={submit}>
        <fieldset>
   
          <label>Name:</label>
          <input id="name" type="text" value={name} readOnly />
          <label>Id:</label>
          <input id="id" type="text" value={id} readOnly />
          <label>Total Balance:</label>
          <input id="balance" type="text" value={balance} readOnly />
          <label>Withdrawals:</label>
          <input id="withdrawals" type="text" value={withdrawals} readOnly />
          <label htmlFor="storeName">Store Name</label>
          <input id="storeName" type="text" value={store} readOnly />
          <label>Store Balance:</label>
          <input id="store_balance" type="text" value={store_balance} readOnly />
          <br />
          <button type="submit" className="pure-button pure-button-primary">Make Withrawal</button>
        </fieldset>
      </form>
    </div>

  )

}

export default PaymentForm
