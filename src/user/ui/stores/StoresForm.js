import React from 'react'
import StoresList from './StoresList'

const AddStoreForm = ({stores, loading, loaded, watch, onAdd=f=>f, onWatch=f=>f, onGet=f=>f,  onSetStore=f=>f, onWatchPurchases=f=>f}) => {

  let _name, _logo

  const submit = e => {
    e.preventDefault()

    onAdd(_name.value, _logo.value)
    onWatch()

    _name.value = ''
    _logo.value = ''

  }

  console.log('Stores Form Entry')

  if (!loaded && !loading) {
    console.log('Stores Form Watch')
    onGet()
    onWatchPurchases()
  }

  return(
    <div>
      <form className="pure-form pure-form-stacked" onSubmit={submit}>
        <fieldset>
          <label htmlFor="name">Provide Store Information</label>
          <br />
          <input id="name" type="text" ref={input => _name = input} placeholder="Name" required/>
          <textarea id="logo" type="text" ref={input => _logo = input} rows={2} cols={30} placeholder="Logo" required/>
          <span className="pure-form-message">These are required fields.</span>
          <br />
          <button type="submit" className="pure-button pure-button-primary">Add Store</button>
        </fieldset>
      </form>
    
      <br />
      <hr />
      <br />
      {loaded && stores.length > 0 ? <label>Double Click to Withdraw Store Funds</label> : null}
      {loading ? <p>Loading Stores...</p> : loaded && stores.length > 0 ? <StoresList stores={stores} setStore={onSetStore}/>
               : <p>No stores found</p>}
      {watch ? <p>Looking for Additional Stores...</p> : null}

    </div>

  )

}

export default AddStoreForm
