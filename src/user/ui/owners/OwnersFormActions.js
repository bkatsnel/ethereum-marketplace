import MarketManagerContract from '../../../../build/contracts/MarketManager.json'
import StoreOwnersContract from '../../../../build/contracts/StoreOwners.json'
// import { browserHistory } from 'react-router'
import store from '../../../store'

const contract = require('truffle-contract')

export const ADD_OWNER = 'ADD_OWNER'
export const START_LOADING_OWNERS = 'START_LOADING_OWNERS'
export const END_LOADING_OWNERS = 'END_LOADING_OWNERS'
export const SET_OWNERS_BLOCK = 'SET_OWNERS_BLOCK'
export const START_WATCHING_OWNERS = 'START_WATCHING_OWNERS'
export const END_WATCHING_OWNERS = 'END_WATCHING_OWNERS'

function addOwnerToStore(owner) {
  return {
    type: ADD_OWNER,
    payload: owner
  }
}

function setOwnersrBlock(fromBlock) {
  return {
    type: SET_OWNERS_BLOCK,
    payload: fromBlock
  }
}

function startLoadingOwners() {
  return {
    type: START_LOADING_OWNERS
  }
}

function endLoadingOwners() {
  return {
    type: END_LOADING_OWNERS
  }
}

function startWatchingOwners() {
  return {
    type: START_WATCHING_OWNERS
  }
}

function endWatchingOwners() {
  return {
    type: END_WATCHING_OWNERS
  }
}

export function addOwner(address, name) {
  let web3 = store.getState().web3.web3Instance
  //Debug COde
  console.log("Add Owner", address, name)
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {

      const MarketMgr = contract(MarketManagerContract)
      MarketMgr.setProvider(web3.currentProvider)

      const StoreOwners = contract(StoreOwnersContract)
      StoreOwners.setProvider(web3.currentProvider)

      // Get current ethereum wallet.
      web3.eth.getCoinbase(async (error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error)
        }

        try { 
          //Get Deployed Marketplace Contract Instance
          let manager = await MarketMgr.deployed();
          let owners_address = await manager.getDeployedStoreOwnersContract.call({from: coinbase})
          // Attempt to sign up user.
          await StoreOwners.at(owners_address).addStoreOwner(address, name, {from: coinbase})
          // If no error, login user.
          return dispatch(startWatchingOwners())

        } catch(error) {
            // If error...
            console.log(error)
        }

      })
    }

  } else {

    console.error('Web3 is not initialized.')

  }
}

export function watchOwners() {

  let web3 = store.getState().web3.web3Instance
  let fromBlock = store.getState().owners.block
  //Debug COde
  console.log("Watch Owners From Block", fromBlock)
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {

      const MarketMgr = contract(MarketManagerContract)
      MarketMgr.setProvider(web3.currentProvider)

      const StoreOwners = contract(StoreOwnersContract)
      StoreOwners.setProvider(web3.currentProvider)

      // Get current ethereum admin.
      web3.eth.getCoinbase(async (error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        try { 
          //Get Deployed Marketplace Contract Instance
          let manager = await MarketMgr.deployed();
          let owners_address = await manager.getDeployedStoreOwnersContract.call({from: coinbase})
          // Indicate Load Start
          dispatch(startWatchingOwners())
          // If from Block is 0 get contrat created block
          if (fromBlock === 0 || fromBlock === undefined) {

            let contractBlock = await manager.getBlockCreated.call({from: coinbase})
            fromBlock = contractBlock.toNumber();
            dispatch(setOwnersrBlock({ "block": fromBlock}))
            console.log("Owners From Block Set to ", fromBlock)

          }
          // Define Event
          let addOwnerEvent = StoreOwners.at(owners_address).LogAddStoreOwner({}, {fromBlock: fromBlock, toBlock: 'latest'})
          // Watch Event
          addOwnerEvent.watch((error, result) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
            // Print Info
            console.log('Owner Watch', result)

            let payload = {
              "owner": { "id": result.args.id.toNumber(), "name": web3.toUtf8(result.args.name), "balance": 0, "stores": 0},
              "block": result.blockNumber
            } 

            console.log('Owners Payload', payload)
            dispatch(addOwnerToStore(payload))

            return dispatch(endWatchingOwners())

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

export function getOwners() {

  let web3 = store.getState().web3.web3Instance
  let fromBlock = store.getState().owners.block
  //Debug COde
  console.log("Get Owners From Block", fromBlock)
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {

      const MarketMgr = contract(MarketManagerContract)
      MarketMgr.setProvider(web3.currentProvider)

      const StoreOwners = contract(StoreOwnersContract)
      StoreOwners.setProvider(web3.currentProvider)
      // Get current ethereum admin.
      web3.eth.getCoinbase(async (error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        try { 
          //Get Deployed Marketplace Contract Instance
          let manager = await MarketMgr.deployed();
          let owners_address = await manager.getDeployedStoreOwnersContract.call({from: coinbase})
          // Indicate Load Start
          dispatch(startLoadingOwners())
          // If from Block is 0 get contrat created block
          if (fromBlock === 0 || fromBlock === undefined) {

            let contractBlock = await manager.getBlockCreated.call({from: coinbase})
            fromBlock = contractBlock.toNumber();
            dispatch(setOwnersrBlock({ "block": fromBlock}))
            console.log("Owners From Block Set to ", fromBlock)

          }
          // Define Event
          let addOwnerEvent = StoreOwners.at(owners_address).LogAddStoreOwner({}, {fromBlock: fromBlock, toBlock: 'latest'})
          // Watch Event
          addOwnerEvent.get((error, results) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }

            results.forEach((result) => {

              let payload = {
                "owner": { "id": result.args.id.toNumber(), "name": web3.toUtf8(result.args.name), "balance": 0, "stores": 0},
                "block": result.blockNumber
              } 

              dispatch(addOwnerToStore(payload))

            })
         
            return dispatch(endLoadingOwners())

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