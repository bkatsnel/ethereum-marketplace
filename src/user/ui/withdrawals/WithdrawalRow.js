import React from 'react';

const PurchaseRow = ({name, amount, timestamp}) =>
    <tr>
        <td>
            {name}
        </td>
        <td>
            {amount}
        </td>
        <td>
            {timestamp}
        </td>
    </tr>

export default PurchaseRow