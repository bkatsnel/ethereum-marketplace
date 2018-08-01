import React from 'react'

import WithdrawalRow from './WithdrawalRow'

const WithdrawalList = ({user, loading, loaded, withdrawals, onWatch=f=>f}) => {

  console.log('Withdrawal List Entry', loading, loaded)

  const goToWithdrawal = () => {
    if (user.balance === 0) {

      alert("Balance is 0 - No Money to Withdraw")

    } else {

      alert("Going to Withdrawal Form")

    }
  }

  const WithdrawalList = (withdrawals) => {
    return (
        <table className="table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Approx Time</th>
            </tr>
            </thead>
            <tbody>
              {withdrawals.map((withdrawal, i) => <WithdrawalRow key={i} {...withdrawal} />)}
            </tbody>
        </table>
    )
  }

  if (!loaded && !loading) {
    console.log('Withdrawals List onWatch')
    onWatch()
  }


  return(
    <div>
      <form className="pure-form pure-form-stacked" >
        <fieldset>
          <label htmlFor="name">Merchant Information - Double Click on Balance to Withdraw</label>
          <br />
          <label>Name:</label>
          <input id="name" type="text" value={user.name} placeholder="Name" readOnly/>
          <label>id:</label>
          <input id="id" type="text" value={user.id}placeholder="Id" readOnly />
          <label>Balance:</label>
          <input id="balance" type="text" value={user.balance}placeholder="Balance" readOnly onDoubleClick={() => goToWithdrawal()}/>
          <label>Withdrawals:</label>
          <input id="withdrawals" type="text" value={user.withdrawals} placeholder="Withdrawals" readOnly />
        </fieldset>
      </form>

      <hr />
      {loading ? <p>Loading Withdrawals...</p> : loaded && withdrawals.length > 0 ? WithdrawalList(withdrawals) :
                 <p>No Withdrawals Found</p>
      }

    </div>

  )

}

export default WithdrawalList
