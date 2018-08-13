import MarketManagerContract from '../../../../build/contracts/MarketManager.json'
import MarketContract from '../../../../build/contracts/Market.json'

import store from '../../../store'

const contract = require('truffle-contract')

export const ADD_ADMINISTRATOR = 'ADD_ADMINISTRATOR'
export const START_ADMINISTRATOR_LOAD = 'START_ADMINISTRATOR_LOAD'
export const END_ADMINISTRATOR_LOAD = 'END_ADMINISTRATOR_LOAD'
export const SET_ADMINISTRATOR_BLOCK = 'SET_ADMINISTRATOR_BLOCK'
export const START_ADMINISTRATOR_WATCH = 'START_ADMINISTRATOR_WATCH'
export const END_ADMINISTRATOR_WATCH = 'END_ADMINISTRATOR_WATCH'

function addAdminToStore(admin) {
  return {
    type: ADD_ADMINISTRATOR,
    payload: admin
  }
}

function startAdministratorLoad() {
  return {
    type: START_ADMINISTRATOR_LOAD
  }
}

function setAdministratorBlock(fromBlock) {
  return {
    type: SET_ADMINISTRATOR_BLOCK,
    payload: fromBlock
  }
}

function endAdministratorLoad() {
  return {
    type: END_ADMINISTRATOR_LOAD
  }
}

function startAdministratorWatch() {
  return {
    type: START_ADMINISTRATOR_WATCH
  }
}

function endAdministratorWatch() {
  return {
    type: END_ADMINISTRATOR_WATCH
  }
}

export function addAdministrator(admin) {
  let web3 = store.getState().web3.web3Instance
  //Debug COde
  console.log("Add Administrator", admin)
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {

      const MarketMgr = contract(MarketManagerContract)
      MarketMgr.setProvider(web3.currentProvider)

      const Market = contract(MarketContract)
      Market.setProvider(web3.currentProvider)

      // Get current ethereum admin.
      web3.eth.getCoinbase(async (error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        try { 
          //Get Deployed Marketplace Contract Instance
          let manager = await MarketMgr.deployed();
          let market_address = await manager.getDeployedMarketContract.call({from: coinbase})
          // Attempt to sign up user.
          await Market.at(market_address).addAdministrator(admin, {from: coinbase})
          // If no error, login user.
          return dispatch(startAdministratorWatch())

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

export function watchAdministrators() {

  let web3 = store.getState().web3.web3Instance
  let fromBlock = store.getState().admins.block
  //Debug COde
  console.log("Watch Administrators From Block", fromBlock)
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {

      const MarketMgr = contract(MarketManagerContract)
      MarketMgr.setProvider(web3.currentProvider)

      const Market = contract(MarketContract)
      Market.setProvider(web3.currentProvider)

      // Get current ethereum admin.
      web3.eth.getCoinbase(async (error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }
        // Indicate Load Start
        dispatch(startAdministratorWatch())

        try { 
          //Get Deployed Marketplace Contract Instance
          let manager = await MarketMgr.deployed();
          let market_address = await manager.getDeployedMarketContract.call({from: coinbase})
          // If from Block is 0 get contrat created block
          if (fromBlock === 0) {

              let contractBlock = await manager.getBlockCreated.call({from: coinbase})
              fromBlock = contractBlock.toNumber()
              dispatch(setAdministratorBlock({ "block": fromBlock}))
              console.log("Admnistrators From Block Set to ", fromBlock)

          }
          // Define Event
          let addAdminEvent = Market.at(market_address).LogAddAdministrator({}, {fromBlock: fromBlock, toBlock: 'latest'})
  
          // Watch Event
          addAdminEvent.watch((error, result) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
            // Print Info
            console.log('Admin Watch', result)

            let payload = {
              "admin": {"id": result.args.index.toNumber(), "address": result.args.admin},
              "block": result.blockNumber
            } 
            // Add Admiin Info To Store
            console.log('Admin Payload', payload)
            dispatch(addAdminToStore(payload))
            // Need to find Way to May it Async
            return dispatch(endAdministratorWatch());

          })

        } catch(error) {
            // If error...
            console.error(error)
            return dispatch(endAdministratorWatch());
        }
      })

  }

  } else {

    console.error('Web3 is not initialized.');

  }
}

export function getAdministrators() {

  let web3 = store.getState().web3.web3Instance
  let fromBlock = store.getState().admins.block
  //Debug COde
  console.log("Get Administrators From Block", fromBlock)
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {

      const MarketMgr = contract(MarketManagerContract)
      MarketMgr.setProvider(web3.currentProvider)

      const Market = contract(MarketContract)
      Market.setProvider(web3.currentProvider)

      // Get current ethereum admin.
      web3.eth.getCoinbase(async (error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }
        // Indicate Load Start
        dispatch(startAdministratorLoad())
        try { 
          //Get Deployed Marketplace Contract Instance
          let manager = await MarketMgr.deployed();
          let market_address = await manager.getDeployedMarketContract.call({from: coinbase})
          // If from Block is 0 get contrat created block
          if (fromBlock === 0) {

              let contractBlock = await manager.getBlockCreated.call({from: coinbase})
              fromBlock = contractBlock.toNumber()
              dispatch(setAdministratorBlock({ "block": fromBlock}))
              console.log("Admnistrators From Block Set to ", fromBlock)

          }
          // Define Events
          let addAdminEvent = Market.at(market_address).LogAddAdministrator({}, {fromBlock: fromBlock, toBlock: 'latest'})
          // Get Results
          addAdminEvent.get((error, results) => {

            if (error) {
              console.error(error)
            }

            results.forEach((result) => {

              let payload = {
                "admin": {"id": result.args.index.toNumber(), "address": result.args.admin},
                "block": result.blockNumber
              } 
              dispatch(addAdminToStore(payload))

            })
   
            return dispatch(endAdministratorLoad());

          })

        } catch(error) {
          // If error...
          console.error(error)
          return dispatch(endAdministratorLoad());

        }
        
      })
    }
  }
}