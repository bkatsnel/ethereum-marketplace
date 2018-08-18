import MarketManagerContract from '../../../../build/contracts/MarketManager.json'
import CustomersContract from '../../../../build/contracts/Customers.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const START_WITHDRAWALS_LOAD = 'START_WITHDRAWALS_LOAD'

function startWithdrawalsLoad() {
  return {
    type: START_WITHDRAWALS_LOAD
  }
}

export function withdrawBalance(name) {
  let web3 = store.getState().web3.web3Instance
  //Debug Code
  console.log("Withdraw Store Balance", name)
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
      // Using truffle-contract we create the market manager object.
      const MarketMgr = contract(MarketManagerContract)
      MarketMgr.setProvider(web3.currentProvider)

      const Customers = contract(CustomersContract)
      Customers.setProvider(web3.currentProvider)
      // Get current ethereum name.
      web3.eth.getCoinbase(async (error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        try { 
          //Get Deployed Market Manager Contract Instance
          let manager = await MarketMgr.deployed();
          let customers_address = await manager.getDeployedCustomersContract.call({from: coinbase})
          // Attempt to sign up user.
          await Customers.at(customers_address).withdrawStoreFunds(name, {from: coinbase})

          return dispatch(startWithdrawalsLoad())

        } catch(error) {
          // If error...
          console.error(error)
        }
      })
    }

  } else {

    console.error('Web3 is not initialized.');

  }
}
