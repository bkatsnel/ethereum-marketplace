import React from 'react'

import EnsRecord from './EnsRecord'

const EnsRecords = (records) => {
    return (
        <table className="table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Address</th>
            </tr>
            </thead>
            <tbody>
              {records.map((record, i) => <EnsRecord key={i} {...record} />)}
            </tbody>
        </table>
    )
  }

const EnsRecordList = ({ records, name, address, loading, loaded, onName=f=>f, onGet=f=>f}) => {

    console.log("EnsRecordList Enter")

    if (!loading && !loaded) {
        console.log("EnsRecordlist Get")
        onName()
        onGet()
    }

    return (
        <div>
            <form className="pure-form pure-form-stacked" >
                <fieldset>
                <label htmlFor="name">Current Account Info</label>
                <br />
                <label>Name:</label>
                <input id="name" type="text" value={name} placeholder="Name" readOnly/>
                <label>Address:</label>
                <input id="address" type="text" value={address}placeholder="Address" size={50} readOnly />
                </fieldset>
            </form>
            <br />
            {loading ? <p>Loading Ens Records...</p> : loaded && records.length > 0 ? EnsRecords(records) : "No ENS records found" }
        </div>
    )

}

export default EnsRecordList