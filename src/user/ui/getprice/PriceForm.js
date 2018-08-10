import React from 'react'

const GetPrice = ({balance, usd, owner, msg, loading, loaded, onWatch=f=>f}) => {

  console.log('GetPrice Form Entry', loading, loaded, balance, usd, owner, msg)

  if (!loaded && !loading) {
    console.log('GetPrice Form onWatch')
    onWatch()
  }

  return(
    <div>
      <form className="pure-form pure-form-stacked" >
        <fieldset>
          <label htmlFor="name">Oraclize Contract Balance and Ether USD Price</label>
          <br />
          <label>Account:</label>
          <input id="owner" type="text" value={owner} placeholder="Account" size={30} readOnly/>
          <label>Ether:</label>
          <input id="balance" type="text" value={balance}placeholder="Balance" readOnly/>
          <label>Usd:</label>
          <input id="usd" type="text" value={usd} placeholder="USD" readOnly />
          <label>Message:</label>
          <textarea id="msg" type="text" value={msg} cols={60} placeholder="Message" readOnly />
        </fieldset>
      </form>

      <hr />
      {loading ? <p>Loading Usd Price...</p> : null}

    </div>

  )

}

export default GetPrice
