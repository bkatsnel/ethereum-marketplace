import OnlineMarketplaceContract from '../../../../build/contracts/OnlineMarketplace.json'
import store from '../../../store'
import { bytes32ToIPFSHash, ipfsHashToBytes32 } from '../../../util/ipfsFuncs'

const contract = require('truffle-contract')

export const ADD_STORE = 'ADD_STORE'
export const START_STORES_LOAD = 'START_STORES_LOAD'
export const END_STORES_LOAD = 'END_STORES_LOAD'
export const START_STORES_WATCH = 'START_STORES_WATCH'
export const END_STORES_WATCH = 'END_STORES_WATCH'
export const SET_STORES_BLOCK = 'SET_STORES_BLOCK'
export const UPDATE_STORE_BALANCE = 'UPDATE_STORE_BALANCE'
export const SET_OWNER_STORE = 'SET_OWNER_STORE'

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

function startStoresWatch() {
  return {
    type: START_STORES_WATCH
  }
}

function endStoresWatch() {
  return {
    type: END_STORES_WATCH
  }
}

function updateStoreBalance(balance) {
  return {
    type: UPDATE_STORE_BALANCE,
    payload: balance
  }
}

export function setOwnerStore(store) {
  return {
    type: SET_OWNER_STORE,
    payload: store
  }
}

export const ADD_PURCHASE = 'ADD_PURCHASE'
export const START_PURCHASES_LOAD = 'START_PURCHASES_LOAD'
export const END_PURCHASES_LOAD = 'END_PURCHASES_LOAD'
export const SET_PURCHASES_BLOCK = 'SET_PURCHASES_BLOCK'

function addPurchase(purchase) {
    return {
      type: ADD_PURCHASE,
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

export function addStores(name, logo) {
  let web3 = store.getState().web3.web3Instance
  let ipfs = store.getState().user.ipfs
  //Debug Code
  console.log("Add Stores", name, logo)
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

          // Create IPFS File And Store its hash 
        
          ipfs.add([Buffer.from(logo)], async (err, res) => {
            if (err) throw err
            console.log('Ipfs Result', res)
            const hash = res[0].hash
            console.log("Logo Hash", hash)
            const bytes32 = ipfsHashToBytes32(hash)
            console.log("Logo Bytes32", hash)
            // Attempt to sign up user.
            await instance.addStore(name, bytes32, {from: coinbase})
            // If no error, login user.
            return dispatch(startStoresWatch())

          })

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

export function watchStores() {
  let web3 = store.getState().web3.web3Instance
  let fromBlock = store.getState().stores.block
  let ipfs = store.getState().user.ipfs
  //Debug Code
  console.log("Watch Stores From Block", fromBlock)
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
        dispatch(startStoresWatch())

        try { 
          //Get Deployed Marketplace Contract Instance
          let instance = await marketplace.deployed();
          // If from Block is 0 get contrat created block
          if (fromBlock === 0) {

              let contractBlock = await instance.getBlockCreated.call({from: coinbase})
              fromBlock = contractBlock.toNumber()
              dispatch(setStoresBlock({ "block": fromBlock}))
              console.log("Watch Stores From Block Set to ", fromBlock)

          }
          // Define Event
          let addStoresEvent = instance.LogAddStore({owner: coinbase}, {fromBlock: fromBlock, toBlock: 'latest'})
          // Watch Event
          addStoresEvent.watch((error, result) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
            // Print Info
            console.log('Stores Watch', result)

            // Get Bytes32 Encoded IPFS Hash And Convert to IPFS 
            let hash = bytes32ToIPFSHash(result.args.descHash)
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
                console.log('Stores Payload', payload)
                return dispatch(addStore(payload))

              })

            })

            return dispatch(endStoresWatch());

          })

        } catch(error) {
            // If error...
            console.error(error)
            return dispatch(endStoresWatch());

        }

      })

  }

  } else {

    console.error('Web3 is not initialized.');

  }
}

function populateStores(results, dispatch, instance, ipfs, web3, coinbase) {

  return new Promise((resolve) => {

    results.forEach(async (result, i, arr) => {
      // Get Bytes32 Encoded IPFS Hash And Convert to IPFS 
      let hash = bytes32ToIPFSHash(result.args.descHash)
      let logo = ''

      let store = await instance.getStore.call(web3.toUtf8(result.args.name), {from: coinbase})
      // console.log('Store Info Returned',store)

      ipfs.cat(hash, (err, res) => {
        if (err) throw err

        res.on('data', (d) => logo += d)
        res.on('end', () => { 
          // Create Store Payload
          let payload = {
            "store": {"name": web3.toUtf8(result.args.name), "owner": result.args.owner, "funds": store[2].toNumber(),
                      "orders": store[5].toNumber(), "logo": logo},
            "block": result.blockNumber
          } 
          // Add Admin Info To Store
          console.log('Stores Payload', payload)
          return dispatch(addStore(payload))

        })

      })

      // When done resolve
      if (i === arr.length - 1) resolve('Done')

    })

  })

}

export function getStores() {
  let web3 = store.getState().web3.web3Instance
  let fromBlock = store.getState().stores.block
  let ipfs = store.getState().user.ipfs
  //Debug Code
  console.log("Get Stores From Block", fromBlock)
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
        dispatch(startStoresLoad())

        try { 
          //Get Deployed Marketplace Contract Instance
          let instance = await marketplace.deployed();
          // If from Block is 0 get contrat created block
          if (fromBlock === 0) {

              let contractBlock = await instance.getBlockCreated.call({from: coinbase})
              fromBlock = contractBlock.toNumber()
              dispatch(setStoresBlock({ "block": fromBlock}))
              console.log("Get Stores From Block Set to ", fromBlock)

          }
          // Define Event
          let addStoresEvent = instance.LogAddStore({owner: coinbase}, {fromBlock: fromBlock, toBlock: 'latest'})
          // Watch Event
          addStoresEvent.get(async (error, results) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
           
            if (results.length > 0) {
              await populateStores(results, dispatch, instance, ipfs, web3, coinbase)
            }
            // results.forEach((result) => {
            //   // Get Bytes32 Encoded IPFS Hash And Convert to IPFS 
            //   let hash = bytes32ToIPFSHash(result.args.descHash)
            //   let logo = ''

            //   ipfs.cat(hash, (err, res) => {
            //     if (err) throw err

            //     res.on('data', (d) => logo += d)
            //     res.on('end', () => { 
            //       // Create Store Payload
            //       let payload = {
            //         "store": {"name": web3.toUtf8(result.args.name), "owner": result.args.owner, "funds": 0, "orders": 0, "logo": logo},
            //         "block": result.blockNumber
            //       } 
            //       // Add Admin Info To Store
            //       console.log('Stores Payload', payload)
            //       return dispatch(addStore(payload))

            //     })

            // })

           })

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

export function watchStorePurchases() {
  let web3 = store.getState().web3.web3Instance
  let fromBlock = store.getState().purchases.block
  //Debug Code
  console.log("Watch Store Purchases From Block", fromBlock)
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
        // Start Purchases Load
        dispatch(startPurchasesLoad());

        try { 
          //Get Deployed Marketplace Contract Instance
          let instance = await marketplace.deployed();
          // If from Block is 0 get contrat created block
          if (fromBlock === 0) {

              let contractBlock = await instance.getBlockCreated.call({from: coinbase})
              fromBlock = contractBlock.toNumber()
              dispatch(setPurchasesBlock({ "block": fromBlock}))
              console.log("Stores Purchases From Block Set to ", fromBlock)

          }
          // Define Event
          let addPurchaseEvent = instance.LogCustomerOrder({owner: coinbase}, {fromBlock: fromBlock, toBlock: 'latest'})
          // Watch Event
          addPurchaseEvent.watch((error, result) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
            // Print Info
            console.log('Store Purchase Watch', result)

            let { name, id, quantity, price, payment, order } = result.args
            let purchases = store.getState().purchases.purchases

            if (purchases.filter((purchase) => purchase.order === order.toNumber()).length === 0) {

              let payload = {
                "purchase": {store: web3.toUtf8(name), id: id.toNumber(), quantity: quantity.toNumber(),
                              price: price.toNumber(), payment: payment.toNumber(), order: order.toNumber()},
                "block": result.blockNumber
              } 
              // Add Admin Info To Store
              console.log('Store Purchases Payload', payload)
              dispatch(addPurchase(payload))
              // Update Store Balance
              let total =  quantity.toNumber() * price.toNumber()
              dispatch(updateStoreBalance({name: web3.toUtf8(name), total: total, order: order}))

            }

            // Not Synced Yet
            return dispatch(endPurchasesLoad());
 
          })

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
