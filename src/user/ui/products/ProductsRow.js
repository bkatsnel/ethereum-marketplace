import React from 'react';

const ProductsRow = ({ id, quantity, price, description }) =>
    <tr>
        <td>
            {id}
        </td>
        <td>
            {quantity}
        </td>
        <td>
            {price}
        </td>
        <td>
            {description}
        </td>
    </tr>

export default ProductsRow