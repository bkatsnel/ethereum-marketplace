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

const EnsRecordList = ({ records, loading, loaded, onGet=f=>f}) => {

    console.log("EnsRecordList Enter")

    if (!loading && !loaded) {
        console.log("EnsRecordlist Watch")
        onGet()
    }

    return (
        <div>
            {loading ? <p>Loading Ens Records...</p> : loaded && records.length > 0 ? EnsRecords(records) : "No ENS records found" }
        </div>
    )

}

export default EnsRecordList