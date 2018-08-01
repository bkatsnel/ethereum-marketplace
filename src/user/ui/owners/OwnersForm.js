import React from 'react'
import OwnersList from './OwnersList'

const AddOwnerForm = ({loading, loaded, owners, watch, onAdd=f=>f, onGet=f=>f, onWatch=f=>f}) => {

  let _name, _address

  const submit = e => {
    e.preventDefault()

    onAdd(_address.value, _name.value)
    onWatch()

    _address.value = ''
    _name.value = ''

  }

  console.log('Owner Form Entry', loading, loaded)

  if (!loaded && !loading) {
    console.log('Owner Form OnGet')
    onGet()
  }

  return(
    <div>
      <form className="pure-form pure-form-stacked" onSubmit={submit}>
        <fieldset>
          <label htmlFor="name">Provide Owner Information</label>
          <br />
          <input id="name" type="text" ref={input => _name = input} placeholder="Name" required/>
          <input id="address" type="text" ref={input => _address = input} placeholder="Address" required />
          <span className="pure-form-message">These are required fields.</span>
          <br />
          <button type="submit" className="pure-button pure-button-primary">Add Owner</button>
        </fieldset>
      </form>
    
      <br />
      <hr />
      {loading ? <p>Loading Owners...</p> : {loaded} && owners.length > 0 ? <OwnersList owners={owners}/> : "No owners found"}
      {watch ? <p>Looking for Additional Owners...</p> : null}

    </div>

  )

}

export default AddOwnerForm
