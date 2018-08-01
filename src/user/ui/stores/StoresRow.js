import React from 'react';
import { browserHistory } from 'react-router'

const goToPayment = (name, funds, setStore) => {
    setStore({store: name, funds: funds})
    browserHistory.push('/payment')
}

const StoresRow = ({ name, owner, funds, orders, setStore=f=>f }) =>
    <tr onDoubleClick={() => goToPayment(name, funds, setStore)}>
        <td>
            {name}
        </td>
        <td>
            {owner}
        </td>
        <td>
            {funds}
        </td>
        <td>
            {orders}
        </td>
    </tr>

export default StoresRow