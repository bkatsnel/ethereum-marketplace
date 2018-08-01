
import React from 'react'

import ProductsRow from './ProductsRow';

const ProductsList = ({ products }) => {

    return (
        <div>
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
                {products.map((product, i) =>
                    <ProductsRow key={i} {...product}  />
                )}
                </tbody>
            </table>
        </div>
    )

}

export default ProductsList