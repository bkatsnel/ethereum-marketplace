import React, { Component } from 'react'
import ProductsFormContainer from '../../ui/products/ProductsFormContainer'

class Products extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Manage Products</h1>
            <ProductsFormContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Products
