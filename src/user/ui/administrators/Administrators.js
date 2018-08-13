import React from 'react'
import AdminsList from './AdminsList'

const AddAdminForm = ({admins, loading, loaded, watch, onAdd=f=>f, onWatch=f=>f, onGet=f=>f}) =>  {
 
  let _address

  const submit = e => {
    e.preventDefault()

    onAdd(_address.value)
    onWatch()

    _address.value = ''

  }

  console.log('Admin Form Entry')

  if (!loaded && !loading) {
    console.log('Admin Form Watch')
    onGet()
  }

  return(
    <div>
      <form className="pure-form pure-form-stacked" onSubmit={submit}>
        <fieldset>
          <label htmlFor="name">Provide Administrator Information</label>
          <br />
          <input id="address" type="text" ref={input => _address = input} placeholder="Address" size={50} required />
          <span className="pure-form-message">This is a required field.</span>
          <br />
          <button type="submit" className="pure-button pure-button-primary">Add Admin</button>
        </fieldset>
      </form>

      <br />
      <hr />
      {loading ? <p>Loading Admins...</p> : {loaded} && admins.length > 0 ? <AdminsList admins={admins} /> : "No admins found" }
      {watch ? <p>Looking for Additional Admins...</p> : null }
    </div>
  )

}

export default AddAdminForm
