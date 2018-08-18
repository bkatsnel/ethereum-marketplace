import MarketManagerContract from '../../../../build/contracts/MarketManager.json'
import CustomersContract from '../../../../build/contracts/Customers.json'
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

      // Using truffle-contract we create the market manager object.
      const MarketMgr = contract(MarketManagerContract)
      MarketMgr.setProvider(web3.currentProvider)

      const Customers = contract(CustomersContract)
      Customers.setProvider(web3.currentProvider)

      // Get current ethereum wallet.
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
          await Customers.at(customers_address).signUp(name, homeAddress, {from: coinbase})
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
