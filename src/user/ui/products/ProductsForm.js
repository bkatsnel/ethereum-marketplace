import React from 'react'
import ProductsList from './ProductsList'

const AddProductForm = ({stores, name, products, loading, loaded, watch, 
  onAdd=f=>f, onWatch=f=>f, onGet=f=>f, onReset=f=>f, onGetStores=f=>f, onStoreChange=f=>f}) => {

  let _id, _quantity, _price, _description
  console.log('Products Form Entry')

  const onDropdownSelected = e => {
    let newStoreName = e.target.value
    console.log("Product Store Select", newStoreName)
    onStoreChange(newStoreName)
    onReset()
  }

  const createSelectItems = () => {
    return (
      <select id="store" type="select" onChange={onDropdownSelected} label="Select Store" >
      {/* <option disabled selected value> -- select an option -- </option> */}
        <option key={0}>{ name !== "" ? name : "--select an option--"}</option>
        {stores.stores.map((store, i) => store.name !== name ? <option key={i}>{store.name}</option> : null)
      }
      </select>
    )
  }  

  const submit = e => {
    e.preventDefault()


    if ( name !== "" && name !== undefined ) {

      onAdd(name, _id.value, _quantity.value, _price.value, _description.value)

      _id.value = ''
      _quantity.value = ''
      _price.value = ''
      _description.value = ''
  
      // console.log("Product Form Submit oon Watch")
      onWatch(name)

    } else {

      alert('Please specify store name.')

    }
   

  }

  if (!stores.loaded && !stores.loading) {
      console.log("Main Products Get Stores")
      onGetStores()
  } 

  if (!loaded && !loading && name !== "") {
      console.log("Main Products Get")
      onGet(name)
  } 

  return(
    <div>
      <label htmlFor="store">Please Select Store</label>
      <br />
      {stores.loading ? <p>Loading Store List...</p> : stores.loaded ? createSelectItems() : null}
      <br />
      <form className="pure-form pure-form-stacked" onSubmit={submit}>
        <fieldset>
          <label htmlFor="id">Provide Product Information</label>
          {/* <br /> */}
          <input id="id" type="text" ref={input => _id = input} placeholder="Id" required/>
          <input id="quantity" type="text" ref={input => _quantity = input} placeholder="Quantity" required/>
          <input id="price" type="text" ref={input => _price = input} placeholder="Price" required/>
          <input id="description" type="text" ref={input => _description = input} placeholder="Description" required/>
          <span className="pure-form-message">These are required fields.</span>
          <br />
          <button type="submit" className="pure-button pure-button-primary">Add Product</button>
        </fieldset>
      </form>
    
      <br />
      <hr />
      <br />
      {/* <label>Double Click to View Product Information</label> */}
      {loading ? <p>Loading Store Products...</p> : 
          loaded && products.length > 0 ? <ProductsList products={products}/> : <p>No Products Found</p> }
      {watch ? <p>Looking for Additional Store Products...</p> : null}
    </div>

  )

}

export default AddProductForm
