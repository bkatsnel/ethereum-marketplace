import PublicResolverContract from '../../../../build/contracts/PublicResolver.json'
import ENSRegistryContract from '../../../../build/contracts/ENSRegistry.json';
import ENS from 'ethereum-ens'
import store from '../../../store'
import namehash from 'eth-ens-namehash'

const contract = require('truffle-contract')

export const ADD_ENS_RECORD = 'ADD_ENS_RECORD'
export const ADD_ENS_DOMAIN = 'ADD_ENS_DOMAIN'
export const START_ENS_LOAD = 'START_ENS_LOAD'
export const END_ENS_LOAD = 'END_ENS_LOAD'

function addEnsRecord(payload) {
  return {
    type: ADD_ENS_RECORD,
    payload: payload
  }
}

function addEnsDomain(payload) {
  return {
    type: ADD_ENS_DOMAIN,
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
      const PublicResolver = contract(PublicResolverContract)
      PublicResolver.setProvider(web3.currentProvider)

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
          let resolver = await PublicResolver.deployed();
          // Define Event
          let addEnsAddressEvent = resolver.AddrChanged({}, {fromBlock: fromBlock, toBlock: 'latest', address: web3.eth.accounts })
          // Watch Event
          addEnsAddressEvent.get(async (error, results) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
            // Process results if any
            if (results.length > 0) {
              await populateEnsStore(results, dispatch, resolver)
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

export function getName() {

  let web3 = store.getState().web3.web3Instance

  console.log("Get ENS Name")

  if (typeof web3 !== 'undefined') {

    // Using truffle-contract we create the resolver object.
    const ENSRegistry = contract(ENSRegistryContract)
    ENSRegistry.setProvider(web3.currentProvider)

    return function(dispatch) {

      // Get current ethereum name.
      web3.eth.getCoinbase(async (error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        try {

          web3.version.getNetwork(async (err, network) => {

            let name
            console.log("Network", network)

            ENSRegistry.setNetwork(network)

            if (network > 10) {

                // let resolver = await PublicResolver.deployed();
                // name = await resolver.name.call(namehash.hash(`${coinbase.slice(2)}.addr.reverse`))

                let ens = await new ENS(web3.currentProvider, ENSRegistry.address);
                name = await ens.reverse(coinbase).name()
                console.log(name)

                // name.call(namehash.hash(`${accounts[i].slice(2)}.addr.reverse`));

            }

            let payload = { "name": name, "address": coinbase }
            console.log("Reverse ENS Payload", payload)

            return dispatch(addEnsDomain(payload))

          })

        } catch(error) {
          
          console.error(error)

        }

        

      })

    }

  } else {

    console.error('Web3 is not initialized.');

  }

}

