import OnlineMarketplaceContract from '../../../../build/contracts/OnlineMarketplace.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const ADD_PURCHASE = 'ADD_PURCHASE'
export const ADD_PURCHASE_AND_WATCH = 'ADD_PURCHASE_AND_WATCH'
export const START_PURCHASES_LOAD = 'START_PURCHASES_LOAD'
export const END_PURCHASES_LOAD = 'END_PURCHASES_LOAD'
export const SET_PURCHASES_BLOCK = 'SET_PURCHASES_BLOCK'
export const START_PURCHASES_WATCH = 'START_PURCHASES_WATCH'
export const END_PURCHASES_WATCH = 'END_PURCHASES_WATCH'
export const RESET_PURCHASES_REFRESH = 'RESET_PURCHASES_REFRESHs'

function addPurchase(purchase) {
    return {
      type: ADD_PURCHASE,
      payload: purchase
    }
}

function addPurchaseAndStopWatch(purchase) {
  return {
    type: ADD_PURCHASE_AND_WATCH,
    payload: purchase
  }
}
  
function startPurchasesLoad() {
    return {
      type: START_PURCHASES_LOAD
    }
}
  
function setPurchasesBlock(fromBlock) {
    return {
      type: SET_PURCHASES_BLOCK,
      payload: fromBlock
    }
}
  
function endPurchasesLoad() {
    return {
      type: END_PURCHASES_LOAD
    }
}
  
function startPurchasesWatch() {
  return {
    type: START_PURCHASES_WATCH
  }
}

function endPurchasesWatch() {
  return {
    type: END_PURCHASES_WATCH
  }
}

function resetPurchasesRefresh() {
  return {
    type: RESET_PURCHASES_REFRESH
  }
}

export function watchPurchases() {
    let web3 = store.getState().web3.web3Instance
    let fromBlock = store.getState().purchases.block
    //Debug Code
    console.log("Watch Orders From Block", fromBlock)
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
          // Indicate Refresh Has Started 
          dispatch(resetPurchasesRefresh())
          // Indicate Load Start
          dispatch(startPurchasesWatch())
  
          try { 
            //Get Deployed Marketplace Contract Instance
            let instance = await marketplace.deployed();
            // If from Block is 0 get contrat created block
            if (fromBlock === 0) {
  
                let contractBlock = await instance.getBlockCreated.call({from: coinbase})
                fromBlock = contractBlock.toNumber()
                dispatch(setPurchasesBlock({ "block": fromBlock}))
                console.log("Purchases From Block Set to ", fromBlock)
  
            }
            // Define Event
            let addPurchasesEvent = instance.LogCustomerOrder({customer: coinbase}, {fromBlock: fromBlock, toBlock: 'latest'})
            // Watch Event
            addPurchasesEvent.watch((err, res) => {
              // Log errors, if any.
              if (err) {
                console.error(err);
              }
              // Print Info
              console.log('Purchases Watch', res)
  
              let { name, id, quantity, price, payment, order } = res.args
              let payload = {
                "purchase": {store: web3.toUtf8(name), id: id.toNumber(), quantity: quantity.toNumber(),
                             price: price.toNumber(), payment: payment.toNumber(), order: order.toNumber() },
                "block": res.blockNumber
              } 
              // Add Admiin Info To Purchase
              console.log('Purchases Payload', payload)
              return dispatch(addPurchaseAndStopWatch(payload))
              
            })
  
          } catch(error) {
              // If error...
              console.error(error)
              return dispatch(endPurchasesWatch());
          }

        })
  
    }
  
    } else {
  
      console.error('Web3 is not initialized.');
  
    }
  }

export function getPurchases() {
  let web3 = store.getState().web3.web3Instance
  let fromBlock = store.getState().purchases.block
  //Debug Code
  console.log("Get Orders From Block", fromBlock)
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
        // Indicate Load Start
        dispatch(startPurchasesLoad())

        try { 
          //Get Deployed Marketplace Contract Instance
          let instance = await marketplace.deployed();
          // If from Block is 0 get contrat created block
          if (fromBlock === 0) {

              let contractBlock = await instance.getBlockCreated.call({from: coinbase})
              fromBlock = contractBlock.toNumber()
              dispatch(setPurchasesBlock({ "block": fromBlock}))
              console.log("Purchases From Block Set to ", fromBlock)

          }
          // Define Event
          let addPurchasesEvent = instance.LogCustomerOrder({customer: coinbase}, {fromBlock: fromBlock, toBlock: 'latest'})
          // Watch Event
          addPurchasesEvent.get((err, results) => {
            // Log errors, if any.
            if (err) {
              console.error(err);
            }
            
            results.forEach((res) => {
              
              let { name, id, quantity, price, payment, order } = res.args
              let payload = {
                "purchase": {store: web3.toUtf8(name), id: id.toNumber(), quantity: quantity.toNumber(),
                              price: price.toNumber(), payment: payment.toNumber(), order: order.toNumber() },
                "block": res.blockNumber
              } 
              // Add Admiin Info To Purchase
              console.log('Purchases Payload', payload)
              return dispatch(addPurchase(payload))

            })

            return dispatch(endPurchasesLoad());

          })

        } catch(error) {
            // If error...
            console.error(error)
            return dispatch(endPurchasesLoad());
        }

      })
  
    }
  
    } else {
  
      console.error('Web3 is not initialized.');
  
    }

  }