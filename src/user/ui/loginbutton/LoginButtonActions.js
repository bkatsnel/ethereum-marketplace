import MarketManagerContract from '../../../../build/contracts/MarketManager.json'
import MarketContract from '../../../../build/contracts/Market.json'
import { browserHistory } from 'react-router'
import store from '../../../store'
// import ipfsAPI from 'ipfs-api'

const contract = require('truffle-contract')

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user
  }
}

export function loginUser() {
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
      
      // Using truffle-contract we create the marketplace object.
      const MarketMgr = contract(MarketManagerContract)
      MarketMgr.setProvider(web3.currentProvider)

      const Market = contract(MarketContract)
      Market.setProvider(web3.currentProvider)

      // Get current ethereum wallet.
      web3.eth.getCoinbase(async (error, coinbase) => {

          let manager = await MarketMgr.deployed();
          let mgrOwner = await manager.owner.call({from: coinbase})
          let market_address = await manager.getDeployedMarketContract.call({from: coinbase})

          // console.log("Manager Owner", mgrOwner, coinbase)
          // console.log("Market Address", market_address)

          if (mgrOwner === coinbase && market_address === "0x0000000000000000000000000000000000000000") {
          
              console.log("Login In As MarketManager Owner")
              let payload = {"name": "Manager", "type": "admin", "address": coinbase}
              dispatch(userLoggedIn(payload))
              return browserHistory.push('/dashboard')

          } else {

              let market = Market.at(market_address)

              try {
                // Attempt to login user.
                let result = await market.login({from: coinbase})
                console.log("Login Result", result)
                let userName, payload
                // let id, userName, homeAddress, balance, orders, withdrawals, payload, ipfs
                let userType=web3.toUtf8(result)

                console.log(web3.toUtf8(result));

                switch(userType) {
                  
                  case "admin": 
                      userName = userType
                      payload = {"name": userName, "type": userType, "address": coinbase}
                      break

                  // case "owner":
                  //     let ownerInfo = await instance.getOwnerInfo.call({from: coinbase});
                  //     id = ownerInfo[0].toNumber()
                  //     userName = web3.toUtf8(ownerInfo[1])
                  //     balance = ownerInfo[2].toNumber()
                  //     withdrawals = ownerInfo[3].toNumber()
                  //     // Add IPFS Connection
                  //     ipfs = ipfsAPI('localhost', '5001')
                  //     // Create OWner user payload
                  //     payload = {
                  //       "name": userName, "type": userType, "address": coinbase,
                  //       "id": id, "balance": balance,  "withdrawals": withdrawals, "ipfs": ipfs
                  //     }
                  //     break

                  // case "customer":
                  //     let customerInfo = await instance.getCustomerInfo.call({from: coinbase});
                  //     userName = web3.toUtf8(customerInfo[0])
                  //     homeAddress = web3.toUtf8(customerInfo[1])
                  //     balance = customerInfo[2].toNumber()
                  //     orders = customerInfo[3].toNumber()
                  //     withdrawals = customerInfo[4].toNumber()
                  //     // Add IPFS Connection
                  //     ipfs = ipfsAPI('localhost', '5001')
                  //     // Create customer user payload
                  //     payload = {
                  //       "name": userName, "type": userType, "address": coinbase,
                  //       "home": homeAddress, "balance": balance, "orders": orders, "withdrawals": withdrawals, "ipfs": ipfs
                  //     }
                  //     break

                  default:
                      userName = "unknown"

                } 

                dispatch(userLoggedIn(payload))

                console.log(store.getState())
                // Used a manual redirect here as opposed to a wrapper.
                // This way, once logged in a user can still access the home page.
                var currentLocation = browserHistory.getCurrentLocation()

                if ('redirect' in currentLocation.query) {
                  return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
                }

                if (userType === "customer") {
                  return browserHistory.push('/marketplace')
                } else {
                  return browserHistory.push('/dashboard')
                }
          
              } catch(error) {
                // If error, go to signup page.
                console.log(error)

                return browserHistory.push('/signup')
              }

          }
       
      })
      
    }

  } else {

    console.error('Web3 is not initialized.');

  }

}
