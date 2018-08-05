import React from 'react'

import PurchaseRow from './PurchaseRow'

const PurchaseList = ({user, loading, loaded, purchases, watch, refresh, onGet=f=>f, onWatch=f=>f}) => {

  console.log('Purchase List Entry', loading, loaded)

  const PurchaseList = (purchases) => {
    return (
        <table className="table">
            <thead>
            <tr>
                <th>Store</th>
                <th>Id</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Payment</th>
            </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, i) => <PurchaseRow key={i} {...purchase} />)}
            </tbody>
        </table>
    )
  }

  if (!loaded && !loading) {
    console.log('Orders/Purchase List onGet')
    onGet()
  }

  if (loaded && refresh) {
    console.log('Orders/Purchase List onWatch')
    onWatch()
  }

  return(
    <div>
      <form className="pure-form pure-form-stacked" >
        <fieldset>
          <label htmlFor="name">Customer Information</label>
          <br />
          <label>Name:</label>
          <input id="name" type="text" value={user.name} placeholder="Name" readOnly/>
          <label>Address:</label>
          <input id="address" type="text" value={user.home}placeholder="Address" readOnly />
          <label>Balance:</label>
          <input id="balance" type="text" value={user.balance}placeholder="Balance" readOnly />
          <label>Order Number:</label>
          <input id="orders" type="text" value={user.orders}placeholder="Order Number" readOnly />
          <label>Overpayment Withdrawals:</label>
          <input id="withdrawals" type="text" value={user.withdrawals} placeholder="Withdrawals" readOnly />
        </fieldset>
      </form>

      <hr />
      {loading ? <p>Loading Orders...</p> : loaded && purchases.length > 0 ? PurchaseList(purchases) :
                 <p>No Orders Found</p>
      }
      {watch ? <p>Looking for Aditional Orders...</p> : null}

    </div>

  )

}

export default PurchaseList
