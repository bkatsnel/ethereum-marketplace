import OnlineMarketplaceContract from '../../../../build/contracts/OnlineMarketplace.json'
import { loginUser } from '../loginbutton/LoginButtonActions'
import store from '../../../store'

const contract = require('truffle-contract')

export function signUpUser(name, homeAddress) {
  let web3 = store.getState().web3.web3Instance
  //Debug COde
  console.log("signUp", name, homeAddress)
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
      // Using truffle-contract we create the marketplace object.
      const marketplace = contract(OnlineMarketplaceContract)
      marketplace.setProvider(web3.currentProvider)


      // Get current ethereum wallet.
      web3.eth.getCoinbase(async (error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        try { 
          //Get Deployed Marketplace Contract Instance
          let instance = await marketplace.deployed();
          // Attempt to sign up user.
          await instance.signUp(name, homeAddress, {from: coinbase})
          // If no error, login user.
          return dispatch(loginUser())

        }catch(error) {
            // If error...
            console.log(error)
        }
      })
    }

  } else {

    console.error('Web3 is not initialized.');

  }
}
