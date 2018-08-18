import MarketManagerContract from '../../../../build/contracts/MarketManager.json'
import CustomersContract from '../../../../build/contracts/Customers.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const ADD_WITHDRAWAL = 'ADD_WITHDRAWAL'
export const START_WITHDRAWALS_LOAD = 'START_WITHDRAWALS_LOAD'
export const END_WITHDRAWALS_LOAD = 'END_WITHDRAWALS_LOAD'
export const SET_WITHDRAWALS_BLOCK = 'SET_WITHDRAWALS_BLOCK'
export const UPDATE_STORE_BALANCE = 'UPDATE_STORE_BALANCE'

function addWithdrawal(withdrawal) {
    return {
      type: ADD_WITHDRAWAL,
      payload: withdrawal
    }
}
  
function startWithdrawalsLoad() {
    return {
      type: START_WITHDRAWALS_LOAD
    }
}
  
function setWithdrawalsBlock(fromBlock) {
    return {
      type: SET_WITHDRAWALS_BLOCK,
      payload: fromBlock
    }
}
  
function endWithdrawalsLoad() {
    return {
      type: END_WITHDRAWALS_LOAD
    }
}
  
function updateStoreBalance(name, withdrawal) {
  return {
    type: UPDATE_STORE_BALANCE,
    payload: { "name": name, "withdrawal": withdrawal }
  }
}

export function watchWithdrawals() {
    let web3 = store.getState().web3.web3Instance
    let fromBlock = store.getState().stores.block
    //Debug Code
    console.log("Watch Withdrawals From Block", fromBlock)
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
          // Indicate Load Start
          dispatch(startWithdrawalsLoad())
  
          try { 
            //Get Deployed Market Manager Contract Instance
            let manager = await MarketMgr.deployed();
            let customers_address = await manager.getDeployedCustomersContract.call({from: coinbase})
            // If from Block is 0 get contrat created block
            if (fromBlock === 0) {
  
                let contractBlock = await manager.getBlockCreated.call({from: coinbase})
                fromBlock = contractBlock.toNumber()
                dispatch(setWithdrawalsBlock({ "block": fromBlock}))
                console.log("Withdrawals From Block Set to ", fromBlock)
  
            }
            // Define Event
            let addWithdrawalsEvent = Customers.at(customers_address).LogOwnerWithdrawal({owner: coinbase}, {fromBlock: fromBlock, toBlock: 'latest'})
            // Watch Event
            addWithdrawalsEvent.watch((err, res) => {
              // Log errors, if any.
              if (err) {
                console.error(err);
              }
              // Print Info
              console.log('Withdrawals Watch', res)
  
              let { owner, name, amount, timestamp } = res.args
              let payload = {
                "withdrawal": {owner: owner, name: web3.toUtf8(name), amount: amount.toNumber(),
                             timestamp: new Date(timestamp.toNumber()*1000).toUTCString()},
                "block": res.blockNumber
              } 
              // Add Admiin Info To Withdrawal
              console.log('Withdrawals Payload', payload)
              dispatch(addWithdrawal(payload))
              dispatch(updateStoreBalance(web3.toUtf8(name), amount.toNumber()))
              return dispatch(endWithdrawalsLoad());
  
            })
  
          } catch(error) {
              // If error...
              console.error(error)
              return dispatch(endWithdrawalsLoad());
          }
        })
  
    }
  
    } else {
  
      console.error('Web3 is not initialized.');
  
    }
  }