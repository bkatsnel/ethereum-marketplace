import MarketManagerContract from '../../../../build/contracts/MarketManager.json'
import CustomersContract from '../../../../build/contracts/Customers.json'
import store from '../../../store'

const contract = require('truffle-contract')

const DESCRIBE_ORDER = 'DESCRIBE_ORDER'
const SET_PURCHASES_REFRESH = 'SET_PURCHASES_REFRESH'

export function describeOrder(order) {
  console.log("Describe Order", order)
  return {
    type: DESCRIBE_ORDER,
    payload: order
  }
}

function setPurchasesRefresh() {
  return {
    type: SET_PURCHASES_REFRESH
  }
}

export function placeOrder(name, id, quantity, price, description) {
  let web3 = store.getState().web3.web3Instance
  //Debug Code
  console.log("Place Order", name, description)
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
          // Calculate Cost And Add Extra 10
          let payment = quantity * price;
          // Attempt to sign up user.
          await Customers.at(customers_address).placeOrder(name, id, quantity, price, description, {value: payment, from: coinbase})
          // Retrun Start Watch
          return dispatch(setPurchasesRefresh())

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
