
import React from 'react'

import StoresRow from './StoresRow';

const StoresList = ({ stores, setStore=f=>f }) => {

    return (
        <div>
            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Owner</th>
                    <th>Balance</th>
                    <th>Orders</th>
                </tr>
                </thead>
                <tbody>
                {stores.map((store, i) =>
                    <StoresRow key={i} { ...store } setStore={setStore} />
                )}
                </tbody>
            </table>
        </div>
    )

}

export default StoresList