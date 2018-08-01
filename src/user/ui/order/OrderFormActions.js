import OnlineMarketplaceContract from '../../../../build/contracts/OnlineMarketplace.json'
import store from '../../../store'

const contract = require('truffle-contract')

const DESCRIBE_ORDER = 'DESCRIBE_ORDER'

export function describeOrder(order) {
  console.log("Describe Order", order)
  return {
    type: DESCRIBE_ORDER,
    payload: order
  }
}

export function placeOrder(name, id, quantity, price, description) {
  let web3 = store.getState().web3.web3Instance
  //Debug Code
  console.log("Place Order", name, description)
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
      // Using truffle-contract we create the marketplace object.
      const marketplace = contract(OnlineMarketplaceContract)
      marketplace.setProvider(web3.currentProvider)

      // Get current ethereum name.
      web3.eth.getCoinbase(async (error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        try { 
          //Get Deployed Marketplace Contract Instance
          let instance = await marketplace.deployed();
          // Calculate Cost And Add Extra 10
          let payment = quantity * price;
          // Attempt to sign up user.
          await instance.placeOrder(name, id, quantity, price, description, {value: payment, from: coinbase})

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
