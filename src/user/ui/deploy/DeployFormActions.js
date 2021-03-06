import MarketManagerContract from '../../../../build/contracts/MarketManager.json'
import StoreOwnersContract from '../../../../build/contracts/StoreOwners.json'
import StoresContract from '../../../../build/contracts/Stores.json'
import CustomersContract from '../../../../build/contracts/Customers.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const WEB3_START_LOADING = 'WEB3_START_LOADING'
export const WEB3_END_LOADING = 'WEB3_END_LOADING'
export const WEB3_UPDATE = 'WEB3_UPDATE'

function startManagerLoad() {
    return {
        type: WEB3_START_LOADING
    }
}

function endManagerLoad() {
    return {
        type: WEB3_END_LOADING
    }
}

function updateWeb3Info(payload) {
    return {
        type: WEB3_UPDATE,
        payload: payload
    }
}

export function getManagerAddress() {

    let web3 = store.getState().web3.web3Instance
    let addressZero = "0x0000000000000000000000000000000000000000"
    //Debug Code
    console.log("Get Manager Address")
    // Double-check web3's status.
    if (typeof web3 !== 'undefined') {

        return function(dispatch) {

            const marketManager = contract(MarketManagerContract)
            marketManager.setProvider(web3.currentProvider)

            // Get current ethereum name.
            web3.eth.getCoinbase(async (error, coinbase) => {
                // Indicate Load Start
                dispatch(startManagerLoad())

                try { 

                    let manager = await marketManager.deployed();
                    let market_address  =  await manager.getDeployedMarketContract.call({from: coinbase});
                    let storage_address  =  await manager.getDeployedStorageContract.call({from: coinbase});
                    let owners_address  =  await manager.getDeployedStoreOwnersContract.call({from: coinbase});
                    let stores_address  =  await manager.getDeployedStoresContract.call({from: coinbase});
                    let customers_address  =  await manager.getDeployedCustomersContract.call({from: coinbase});
                    let block = await manager.getBlockCreated.call({from: coinbase})

                    let payload = {
                        manager: manager,
                        market: market_address === addressZero ? "" : market_address,
                        storage: storage_address === addressZero ? "" : storage_address,
                        owners: owners_address === addressZero ? "" : owners_address,
                        stores: stores_address === addressZero ? "" : stores_address,
                        customers: customers_address === addressZero ? "" : customers_address,
                        block: block.toNumber()
                    }

                    console.log("Market Contract", payload)
                    dispatch(updateWeb3Info(payload))
                    return dispatch(endManagerLoad())

                } catch(error) {

                    console.error(error)

                }

            })
        }
    }

}
  
export function deployMarket() {

    let web3 = store.getState().web3.web3Instance
    let fromBlock = store.getState().web3.block
    //Debug Code
    console.log("Deploy Market Contract")
    // Double-check web3's status.
    if (typeof web3 !== 'undefined') {

        return function(dispatch) {

            const marketManager = contract(MarketManagerContract)
            marketManager.setProvider(web3.currentProvider)

            // Get current ethereum name.
            web3.eth.getCoinbase(async (error, coinbase) => {
                // Indicate Load Start
                dispatch(startManagerLoad())

                try { 

                    let manager = await marketManager.deployed();

                    await manager.deployMarketContract({from: coinbase})

                    let marketContractDeployed = manager.MarketContractDeployed({}, {fromBlock: fromBlock, toBlock: 'latest'})

                    marketContractDeployed.watch((error, result) => {

                        // Log errors, if any.
                        if (error) {
                            console.error(error);
                        }
                    
                        let payload = {
                            market: result.args.market,
                            storage: result.args.estorage,
                            block: result.args.block.toNumber()
                        }
    
                        console.log("Market Contract", payload)
                        dispatch(updateWeb3Info(payload))
                        return dispatch(endManagerLoad())
    
                    })

                } catch(error) {

                    console.error(error)

                }

            })
        }
    }

}

export function deployStoreOwners() {

    let web3 = store.getState().web3.web3Instance
    let fromBlock = store.getState().web3.block
    //Debug Code
    console.log("Deploy Store Owners Contract")
    // Double-check web3's status.
    if (typeof web3 !== 'undefined') {

        return function(dispatch) {

            const marketManager = contract(MarketManagerContract)
            marketManager.setProvider(web3.currentProvider)

            const StoreOwners = contract(StoreOwnersContract)
            StoreOwners.setProvider(web3.currentProvider)

            // Get current ethereum name.
            web3.eth.getCoinbase(async (error, coinbase) => {
                // Indicate Load Start
                dispatch(startManagerLoad())

                try { 

                    let manager = await marketManager.deployed();
                    let owners = await StoreOwners.deployed(manager.address)

                    await manager.deployStoreOwnersContract(owners.address, {from: coinbase})

                    let storeOwnersContractDeployed = manager.StoreOwnersContractDeployed({}, {fromBlock: fromBlock, toBlock: 'latest'})

                    storeOwnersContractDeployed.watch((error, result) => {

                        // Log errors, if any.
                        if (error) {
                            console.error(error);
                        }
                    
                        let payload = {
                            owners: result.args.owners,
                        }
    
                        console.log("Store Owners Contract", payload)
                        dispatch(updateWeb3Info(payload))
                        return dispatch(endManagerLoad())
    
                    })

                } catch(error) {

                    console.error(error)

                }

            })
        }
    }

}
   
export function deployStores() {

    let web3 = store.getState().web3.web3Instance
    let fromBlock = store.getState().web3.block
    //Debug Code
    console.log("Deploy Stores Contract")
    // Double-check web3's status.
    if (typeof web3 !== 'undefined') {

        return function(dispatch) {

            const marketManager = contract(MarketManagerContract)
            marketManager.setProvider(web3.currentProvider)

            const Stores = contract(StoresContract)
            Stores.setProvider(web3.currentProvider)

            // Get current ethereum name.
            web3.eth.getCoinbase(async (error, coinbase) => {
                // Indicate Load Start
                dispatch(startManagerLoad())

                try { 

                    let manager = await marketManager.deployed();
                    let stores = await Stores.deployed(manager.address)

                    await manager.deployStoresContract(stores.address, {from: coinbase})

                    let storesContractDeployed = manager.StoresContractDeployed({}, {fromBlock: fromBlock, toBlock: 'latest'})

                    storesContractDeployed.watch((error, result) => {

                        // Log errors, if any.
                        if (error) {
                            console.error(error);
                        }
                    
                        let payload = {
                            stores: result.args.stores,
                        }
    
                        console.log("Stores Contract", payload)
                        dispatch(updateWeb3Info(payload))
                        return dispatch(endManagerLoad())
    
                    })

                } catch(error) {

                    console.error(error)

                }

            })
        }
    }

}

export function deployCustomers() {

    let web3 = store.getState().web3.web3Instance
    let fromBlock = store.getState().web3.block
    //Debug Code
    console.log("Deploy Customers Contract")
    // Double-check web3's status.
    if (typeof web3 !== 'undefined') {

        return function(dispatch) {

            const marketManager = contract(MarketManagerContract)
            marketManager.setProvider(web3.currentProvider)

            const Customers = contract(CustomersContract)
            Customers.setProvider(web3.currentProvider)

            // Get current ethereum name.
            web3.eth.getCoinbase(async (error, coinbase) => {
                // Indicate Load Start
                dispatch(startManagerLoad())

                try { 

                    let manager = await marketManager.deployed();
                    let customers = await Customers.deployed(manager.address)

                    await manager.deployCustomersContract(customers.address, {from: coinbase})

                    let customersContractDeployed = manager.CustomersContractDeployed({}, {fromBlock: fromBlock, toBlock: 'latest'})

                    customersContractDeployed.watch((error, result) => {

                        // Log errors, if any.
                        if (error) {
                            console.error(error);
                        }
                    
                        let payload = {
                            customers: result.args.customers,
                        }
    
                        console.log("Customers Contract", payload)
                        dispatch(updateWeb3Info(payload))
                        return dispatch(endManagerLoad())
    
                    })

                } catch(error) {

                    console.error(error)

                }

            })
        }
    }

}

