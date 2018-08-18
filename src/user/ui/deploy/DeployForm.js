import React from 'react'

const DeployForm = ({web3, manager, market, storage, owners, stores, loading, 
     onMarket=f=>f, onOwners=f=>f, onStores=f=>f, onGetMgr=f=>f}) => {

  console.log('Deploy Form Entry', web3)

  const submit = e => {
    e.preventDefault()
    market === "" ? onMarket() : owners === "" ? onOwners() : onStores()
  }

  const isVisiable = () => {
    return (market === "" || owners === "" || stores === "") ? true : false
  }

  const toDeploy = () => {
    return market === "" ? "Market" : owners === "" ? "Store Owners" : "Stores"
  }

  if (manager === "" && !loading) {

     onGetMgr()

  }

  return(
    <div>
      <h3 htmlFor="store">Deploy Market Contract if Not Yet Done</h3>
      <form className="pure-form pure-form-stacked" onSubmit={submit}>
        <fieldset>
          <label htmlFor="web3api">Web3 Api Version</label>
          <input id="web3api" type="text" value={web3.version.api} size={10} readOnly />
          <label>Manager Address:</label>
          <input id="manager" type="text" value={manager !== "" ? manager.address : "" } size={50} readOnly />
          <label>Market Address:</label>
          <input id="market" type="text" value={market === "" ? "Not Deployed" : market} size={50} readOnly />
          <label>Storage Address:</label>
          <input id="storage" type="text" value={storage === "" ? "N/A" : storage} size={50} readOnly />
          <label>Store Owners Address:</label>
          <input id="owners" type="text" value={owners === "" ? "N/A" : owners} size={50} readOnly />
          <label>Stores Address:</label>
          <input id="stores" type="text" value={stores === "" ? "N/A" : stores} size={50} readOnly />
          <br />
          <button type="submit" className="pure-button pure-button-primary" hidden={ isVisiable() ? "" : "hidden"}>Deploy {toDeploy()} Contract</button>
        </fieldset>
      </form>
      <br />
      {loading ? <p>Please, Wait For Blockchain Operation To Complete...</p> : null}
    </div>

  )

}

export default DeployForm
