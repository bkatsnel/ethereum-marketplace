
import React from 'react'

import AdminsRow from './AdminsRow';

const AdminsList = ({ admins }) => {

    return (
        <div>
            <table className="table">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Address</th>
                </tr>
                </thead>
                <tbody>
                {admins.map((admin, i) =>
                    <AdminsRow key={i} {...admin}  />
                )}
                </tbody>
            </table>
        </div>
    )

}

export default AdminsList