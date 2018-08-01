import OnlineMarketplaceContract from '../../../../build/contracts/OnlineMarketplace.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const ADD_PRODUCT = 'ADD_PRODUCT'
// export const RESET_PRODUCTS_LOADED = 'RESET_PRODUCTS_LOADED'
export const START_PRODUCTS_LOAD = 'START_PRODUCTS_LOAD'
export const END_PRODUCTS_LOAD = 'END_PRODUCTS_LOAD'
export const SET_PRODUCTS_BLOCK = 'SET_PRODUCTS_BLOCK'
export const CHANGE_PRODUCTS_STORE_NAME = 'CHANGE_PRODUCTS_STORE_NAME'
export const SET_PRODUCTS_STORE_NAME = 'SET_PRODUCTS_STORE_NAME'

function addProduct(name) {
  return {
    type: ADD_PRODUCT,
    payload: name
  }
}

// function resetProductsLoaded() {
//   return {
//     type: RESET_PRODUCTS_LOADED
//   }
// }

function startProductsLoad() {
  return {
    type: START_PRODUCTS_LOAD
  }
}

function setProductsBlock(fromBlock) {
  return {
    type: SET_PRODUCTS_BLOCK,
    payload: fromBlock
  }
}

function endProductsLoad() {
  return {
    type: END_PRODUCTS_LOAD
  }
}

export function changeProductsStoreName(name) {
  return {
    type: CHANGE_PRODUCTS_STORE_NAME,
    payload: {"name": name}
  }
}

export function setProductsStoreName(name) {
  return {
    type: SET_PRODUCTS_STORE_NAME,
    payload: {"name": name}
  }
}

export function addProducts(name, id, quanity, price, description) {
  let web3 = store.getState().web3.web3Instance
  //Debug Code
  console.log("Add Products", name, description)
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
          // Debug Message
          console.log("Adding Product", name, id, quanity, price, description)
          // Attempt to sign up user.
          await instance.addStoreProduct(name, id, quanity, price, description, {from: coinbase})
          // If no error, login user.
          // dispatch(resetProductsLoaded())

          // Invoke watchProducts
          return watchProducts(name)

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

export function watchProducts(name) {
  // Retrieve State Info
  let web3 = store.getState().web3.web3Instance
  let fromBlock = store.getState().products.block
  //Debug Code
  console.log("Watch Products From Block", fromBlock, name)
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
        dispatch(startProductsLoad())

        try { 
          //Get Deployed Marketplace Contract Instance
          let instance = await marketplace.deployed();
          // If from Block is 0 get contrat created block
          if (fromBlock === 0) {

              let contractBlock = await instance.getBlockCreated.call({from: coinbase})
              fromBlock = contractBlock.toNumber()
              dispatch(setProductsBlock({ "block": fromBlock}))
              console.log("Products From Block Set to ", fromBlock)

          }
          // Define Event
          let addProductsEvent = instance.LogAddStoreProduct({name: name}, {fromBlock: fromBlock, toBlock: 'latest'})
          // Watch Event
          addProductsEvent.watch((error, result) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
            // Print Info
            console.log('Products Watch', result)
            console.log('Products Watch Name', name)

            // Fix For Filtering Problem
            if (name ===  web3.toUtf8(result.args.name)) {

              let payload = {
                "product": {"id": result.args.id.toNumber(), 
                            "quantity": result.args.quantity.toNumber(), 
                            "price":  result.args.price.toNumber(),
                            "description":  web3.toUtf8(result.args.description),
                },
                "block": result.blockNumber,
                "name": name
              } 
              // Add Admiin Info To Product
              console.log('Products Payload', payload)
              return dispatch(addProduct(payload))

            } 

          })
          // Not yet synced with watch
          return dispatch(endProductsLoad());

        } catch(error) {
            // If error...
            console.error(error)
            return dispatch(endProductsLoad());
        }
      })

  }

  } else {

    console.error('Web3 is not initialized.');

  }
}