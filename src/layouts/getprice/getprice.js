import React, { Component } from 'react'

class GetEthPrice extends Component {

    constructor(props) {
        super(props)
        this.state = {
            balance: 0,
            usd: 0
        }
    }

    componentDidMount () {
    }
    
    render() {
        return (
         <main className="container">
            <div className="pure-g">
                <div className="pure-u-1-1">
                    <h1>Ethereum Balance And Price via Coinbase Oraclize</h1>
                    <p><strong>Welcome to Online Marketplace Powered by Blockchain</strong></p>
                </div>
            </div>
         </main>
        )
    }

}

export default GetEthPrice