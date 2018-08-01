import React from 'react'
import { browserHistory } from 'react-router'

const OrderForm = ({name, id, price, description, available, onPlace=f=>f}) => {

  let _quantity
  console.log('Order Form Entry')

  const submit = e => {
    e.preventDefault()

    onPlace(name, id, _quantity.value, price, description)
    _quantity.value = ''

    var currentLocation = browserHistory.getCurrentLocation()

    if ('redirect' in currentLocation.query) {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
    }

    browserHistory.push('/purchases')

  }

  return(
    <div>
      <h3 htmlFor="store">{name} Product Order Form - Please, Specify Quantity And Submit</h3>
      <form className="pure-form pure-form-stacked" onSubmit={submit}>
        <fieldset>
          <label htmlFor="storeName">Store Name</label>
          <input id="storeName" type="text" value={name} readOnly />
          <label>Description:</label>
          <input id="description" type="text" value={description} readOnly />
          <label>Product Id:</label>
          <input id="id" type="text" value={id} readOnly />
          <label>Availability:</label>
          <input id="available" type="text" value={available} readOnly />
          <label>Price:</label>
          <input id="price" type="text" value={price} readOnly />
          <br />
          <label>Quantity:</label>
          <input id="quantity" type="text" ref={input => _quantity = input} placeholder="Quantity" required/>
          <span className="pure-form-message">This is a required field.</span>
          <br />
          <button type="submit" className="pure-button pure-button-primary">Place Order</button>
        </fieldset>
      </form>
    </div>

  )

}

export default OrderForm
