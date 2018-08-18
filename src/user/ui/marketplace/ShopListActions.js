import MarketManagerContract from '../../../../build/contracts/MarketManager.json'
import StoresContract from '../../../../build/contracts/Stores.json'
// import CustomersContract from '../../../../build/contracts/Customers.json'
import store from '../../../store'
import { bytes32ToIPFSHash } from '../../../util/ipfsFuncs'

const contract = require('truffle-contract')

export const ADD_STORE = 'ADD_STORE'
export const START_STORES_LOAD = 'START_STORES_LOAD'
export const END_STORES_LOAD = 'END_STORES_LOAD'
export const SET_STORES_BLOCK = 'SET_STORES_BLOCK'

function addStore(name) {
  return {
    type: ADD_STORE,
    payload: name
  }
}

function startStoresLoad() {
  return {
    type: START_STORES_LOAD
  }
}

function setStoresBlock(fromBlock) {
  return {
    type: SET_STORES_BLOCK,
    payload: fromBlock
  }
}

function endStoresLoad() {
  return {
    type: END_STORES_LOAD
  }
}

export function watchStores() {
  let web3 = store.getState().web3.web3Instance
  let fromBlock = store.getState().stores.block
  let ipfs = store.getState().user.ipfs
  //Debug Code
  console.log("Watch Shops From Block", fromBlock)
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {

      // Using truffle-contract we create the marketplace object.
      const MarketMgr = contract(MarketManagerContract)
      MarketMgr.setProvider(web3.currentProvider)

      const Stores = contract(StoresContract)
      Stores.setProvider(web3.currentProvider)

      // Get current ethereum name.
      web3.eth.getCoinbase(async (error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }
        // Indicate Load Start
        dispatch(startStoresLoad())

        try { 
          //Get Deployed Marketplace Contract Instance
          let manager = await MarketMgr.deployed();
          let stores_address = await manager.getDeployedStoresContract.call({from: coinbase})
          // Create IPFS File And Store its hash 
          // If from Block is 0 get contrat created block
          if (fromBlock === 0) {

              let contractBlock = await manager.getBlockCreated.call({from: coinbase})
              fromBlock = contractBlock.toNumber()
              dispatch(setStoresBlock({ "block": fromBlock}))
              console.log("Shops From Block Set to ", fromBlock)

          }
          // Define Event
          let addStoresEvent = Stores.at(stores_address).LogAddStore({}, {fromBlock: fromBlock, toBlock: 'latest'})
          // Watch Event
          addStoresEvent.watch((error, result) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
            // Print Info
            console.log('Shops Watch', result)

            // Get Bytes32 Encoded IPFS Hash And Convert to IPFS 
            let hash = bytes32ToIPFSHash(result.args.descHash)
            console.log("Shop Hash", hash)
            let logo = ''

            ipfs.cat(hash, (err, res) => {
              if (err) throw err

              res.on('data', (d) => logo += d)
              res.on('end', () => { 
                // Create Store Payload
                let payload = {
                  "store": {"name": web3.toUtf8(result.args.name), "owner": result.args.owner, "funds": 0, "orders": 0, "logo": logo},
                  "block": result.blockNumber
                } 
                // Add Admin Info To Store
                console.log('Shops Payload', payload)
                return dispatch(addStore(payload))

              })

            })

          })
          // Not Synced Yet
          return dispatch(endStoresLoad());

        } catch(error) {
            // If error...
            console.error(error)
            return dispatch(endStoresLoad());
        }
      })

  }

  } else {

    console.error('Web3 is not initialized.');

  }
}