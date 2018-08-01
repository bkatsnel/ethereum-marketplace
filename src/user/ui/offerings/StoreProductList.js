
import React from 'react'

import StoreProductRow from './StoreProductRow';

const StoreProductList = ({name, loading, loaded, products, onWatch=f=>f, onSelect=f=>f }) => {

    console.log("StoreProductList Enter", name)

    if (!loading && !loaded) {
        console.log("StoreProductList Watch With Name", name)
        onWatch(name)
    }

    const listProducts = (products, name) => {
        return (
            <table className="table">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => <StoreProductRow key={i} {...product} name={name} onSelect={onSelect} />)}
                </tbody>
            </table>
        )
    }

    return (
      <div>
        <h2>{name} Products - Double Click to Purchase</h2>
        <hr />
        {loading ? <p>Loading Products...</p> : loaded && products.length > 0 ? listProducts(products, name) :<p>No Products Found</p>}
      </div>
    )

}

export default StoreProductList