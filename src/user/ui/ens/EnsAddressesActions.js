// import OnlineresolverContract from '../../../../build/contracts/Onlineresolver.json'
import PublicResolver from '../../../../build/contracts/PublicResolver.json'
import store from '../../../store'
import namehash from 'eth-ens-namehash'

const contract = require('truffle-contract')

export const ADD_ENS_RECORD = 'ADD_ENS_RECORD'
export const START_ENS_LOAD = 'START_ENS_LOAD'
export const END_ENS_LOAD = 'END_ENS_LOAD'

function addEnsRecord(payload) {
  return {
    type: ADD_ENS_RECORD,
    payload: payload
  }
}

function startENSLoad() {
  return {
    type: START_ENS_LOAD
  }
}


function endENSLoad() {
  return {
    type: END_ENS_LOAD
  }
}

function populateEnsStore(results, dispatch, instance) {

  return new Promise((resolve) => {

    results.forEach(async (result, i, arr) =>  {

      let name = await instance.name.call(namehash.hash(`${result.args.a.slice(2)}.addr.reverse`));
      // Build Ens Record Payload
      let payload = {
        "record": {"node": result.args.node, "address": result.args.a, "name": name},
        "block": result.blockNumber
      } 
      // console.log('ENS Payload', payload)
      dispatch(addEnsRecord(payload))
      // When done resolve
      if (i === arr.length - 1) resolve('Done')
      
    })

  })

}

export function getENS() {
  let web3 = store.getState().web3.web3Instance
  let fromBlock = store.getState().ens.block
  //Debug Code
  console.log("Watch ENS From Block", fromBlock)
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {

      // Using truffle-contract we create the resolver object.
      const resolver = contract(PublicResolver)
      resolver.setProvider(web3.currentProvider)

      // Get current ethereum name.
      web3.eth.getCoinbase(async (error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }
        // Indicate Load Start
        dispatch(startENSLoad())

        try { 
          //Get Deployed resolver Contract Instance
          let instance = await resolver.deployed();
          // Define Event
          let addEnsAddressEvent = instance.AddrChanged({}, {fromBlock: fromBlock, toBlock: 'latest', address: web3.eth.accounts })
          // Watch Event
          addEnsAddressEvent.get(async (error, results) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
            // Process results if any
            if (results.length > 0) {
              await populateEnsStore(results, dispatch, instance)
            }
            // Set load complete when done
            return dispatch(endENSLoad());

          })

        } catch(error) {
            // If error...
            console.error(error)
            return dispatch(endENSLoad());

        }

      })

  }

  } else {

    console.error('Web3 is not initialized.');

  }
}

