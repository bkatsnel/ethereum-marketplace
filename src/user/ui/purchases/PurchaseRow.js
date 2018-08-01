import React from 'react';

const PurchaseRow = ({store, id, quantity, price, payment, }) =>
    <tr>
        <td>
            {store}
        </td>
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
            {quantity * price}
        </td>
        <td>
            {payment}
        </td>
    </tr>

export default PurchaseRow