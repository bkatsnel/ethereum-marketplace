import React from 'react';

const OwnersRow = ({ id, name, balance, stores }) =>
    <tr>
        <td>
            {id}
        </td>
        <td>
            {name}
        </td>
        <td>
            {balance}
        </td>
        <td>
            {stores}
        </td>
    </tr>

export default OwnersRow