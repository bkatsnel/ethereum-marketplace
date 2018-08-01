import OnlineMarketplaceContract from '../../../../build/contracts/OnlineMarketplace.json'
import store from '../../../store'

const contract = require('truffle-contract')

export function withdrawBalance(name) {
  let web3 = store.getState().web3.web3Instance
  //Debug Code
  console.log("Withdraw Store Balance", name)
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
          // Attempt to sign up user.
          await instance.withdrawStoreFunds(name, {from: coinbase})

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
