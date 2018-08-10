import OnlineMarketplaceContract from '../../../../build/contracts/OraclizeGetPrice.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const START_PRICE_LOAD = 'START_PRICE_LOAD'
export const END_PRICE_LOAD = 'END_PRICE_LOAD'
export const UPDATE_PRICE = 'UPDATE_PRICE'
export const UPDATE_BALANCE = 'UPDATE_BALANCE'
export const UPDATE_PRICE_MSG = 'UPDATE_PRICE_MSG'
// export const SET_PRICE_BLOCK = 'SET_PRICE_BLOCK'

function startPriceLoad() {
  return {
    type: START_PRICE_LOAD
  }
}

function endPriceLoad() {
  return {
    type: END_PRICE_LOAD
  }
}

function updatePrice(payload) {
  return {
    type: UPDATE_PRICE,
    payload: payload
  }
}

function updateBalance(payload) {
  return {
    type: UPDATE_BALANCE,
    payload: payload
  }
}

function updatePriceMsg(payload) {
  return {
    type: UPDATE_PRICE_MSG,
    payload: payload
  }
}

// function setPriceBlock(payload) {
//   return {
//     type: SET_PRICE_BLOCK,
//     ...payload
//   }
// }

export function watchPrice() {

  let web3 = store.getState().web3.web3Instance
  let fromBlock = store.getState().price.block
  //Debug COde
  console.log("Watch Get Price From Block", fromBlock)
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {

      // Using truffle-contract we create the getprice object.
      const getprice = contract(OnlineMarketplaceContract)
      getprice.setProvider(web3.currentProvider)

      // Get current ethereum admin.
      web3.eth.getCoinbase(async (error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }
        // Indicate Load Start
        dispatch(startPriceLoad())

        try { 
          //Get Deployed Marketplace Contract Instance
          let instance = await getprice.deployed();
          // If from Block is 0 get contrat created block
          // if (fromBlock === 0) {

          //     let contractBlock = await instance.getBlockCreated.call({from: coinbase})
          //     fromBlock = contractBlock.toNumber()
          //     dispatch(setPriceBlock({ "block": fromBlock}))
          //     console.log("Price Watch From Block Set to ", fromBlock)

          // }
          // Define Event
          let logUpdate = instance.LogUpdate({}, {fromBlock: fromBlock, toBlock: 'latest'})
          let logInfo = instance.LogInfo({}, {fromBlock: fromBlock, toBlock: 'latest'})
          let logPriceUpdate = instance.LogPriceUpdate({}, {fromBlock: fromBlock, toBlock: 'latest'})
          // Watch Event
          logUpdate.watch((error, result) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
            // Print Info
            console.log('Balance Watch', result)

            let payload1 = {
              "owner": result.args._owner,
              "balance": web3.fromWei(result.args._balance, 'ether').toString()
            } 
            // Add Admiin Info To Store
            console.log('Balance Payload', payload1)
            return dispatch(updateBalance(payload1))

          })

          logInfo.watch((error, result) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
            // Print Info
            console.log('Price Log Watch', result)

            let payload = {
              "msg": result.args.description
            } 
            // Add Admiin Info To Store
            console.log('Price Log Payload', payload)
            return dispatch(updatePriceMsg(payload))

          })

          logPriceUpdate.watch((error, result) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
            // Print Info
            console.log('Price Watch', result)

            let payload = {
              "usd": result.args.price,
              "loaded": true,
              "loading": false,
              "msg": "Price update has been received"
            } 
            // Add Admiin Info To Store
            console.log('Price Payload', payload)
            return dispatch(updatePrice(payload))

          })

        } catch(error) {
            // If error...
            console.error(error)
            return dispatch(endPriceLoad());
        }
      })

  }

  } else {

    console.error('Web3 is not initialized.');

  }
}

