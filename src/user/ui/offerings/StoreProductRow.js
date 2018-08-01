import React from 'react';
import { browserHistory } from 'react-router'

const goToOrder = (name, id, quantity, price, description, onSelect) => {
    console.log('On Offering Store Double Click')
    let orderDesc = { name: name, id: id, available: quantity, price: price, description: description}
    onSelect(orderDesc)

    var currentLocation = browserHistory.getCurrentLocation()

    if ('redirect' in currentLocation.query) {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
    }

    browserHistory.push('/order')
}

const StoreProductRow = ({name, id, quantity, price, description, onSelect=f=>f}) =>
    <tr onDoubleClick={() => goToOrder(name, id, quantity, price, description, onSelect)}>
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

export default StoreProductRow