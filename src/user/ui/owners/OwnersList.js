
import React from 'react'

import OwnersRow from './OwnersRow';

const OwnersList = ({ owners }) => {

    return (
        <div>
            <table className="table">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Balance</th>
                    <th>Stores</th>
                </tr>
                </thead>
                <tbody>
                {owners.map((owner, i) =>
                    <OwnersRow key={i} {...owner}  />
                )}
                </tbody>
            </table>
        </div>
    )

}

export default OwnersList