var MarketManager = artifacts.require("./MarketManager.sol")
var Market = artifacts.require("./Market.sol")
var StoreOwners = artifacts.require("./StoreOwners.sol")
var Stores = artifacts.require("./Stores.sol")
var Customers = artifacts.require("./Customers.sol")
var EternalStorage = artifacts.require("./EternalStorage.sol")

const truffleAssert = require('truffle-assertions')

contract('MarketManager', function(accounts) {

    let manager, market, storage, new_market, upg_market, owners, stores, customers
    const ownerAcct = accounts[0]

    //   beforeEach(async () => {
    //     manager = await MarketManager.deployed()
    //   })

    //   afterEach(async () => {
    //     await manager.destroy({from: ownerAcct})
    //   })

    describe('Verify Market Manager Contract Owner', async () => { 

            it("Initial balance should be 0", async() => {
                manager = await MarketManager.deployed()
                assert.equal(web3.eth.getBalance(manager.address).toNumber(), 0)
                // console.log("Manager", manager.address)
            })

            it("Contract owner should be accouny[0]", async() => {
                let owner = await manager.owner.call({from: ownerAcct})
                // console.log('Owner', owner)
                assert.equal(owner, ownerAcct)
            })

    })

    describe('Verify Initial Market Contact Deployment', async () => { 

        it("Deploy Initial Market Contract", async() => {
            let tx = await manager.deployMarketContract({from: ownerAcct})
        
            truffleAssert.eventEmitted(tx, 'MarketContractDeployed', (ev) => {
                return true
            }, "MarketContractDeployed event should have been emiited.")

        })

        it("Get Initial Market Contract Address", async() => {
        
            market = await manager.getDeployedMarketContract.call({from: ownerAcct})
            assert.notEqual(market, 0x0000000000000000000000000000000000000000)
            // console.log("Market", market)
        })

        it("Get Eternal Storage Contract Address", async() => {
            
            storage = await manager.getDeployedStorageContract.call({from: ownerAcct})
            assert.notEqual(storage, "0x0000000000000000000000000000000000000000")
            // console.log("Storage", storage)
        })
        
        it("Get Eternal Storage Contract Owner", async() => {
        
            let owner = await EternalStorage.at(storage).owner.call({from: ownerAcct})
            assert.equal(owner, market)
            // console.log("sOwner", owner)
        })

    })
 
    describe('Verify Initial Store Owners Contact Deployment', async () => { 

        it("Deploy Initial StoreOwners Contract", async() => {

            owners = await StoreOwners.deployed(manager.address);

            let tx = await manager.deployStoreOwnersContract(owners.address, {from: ownerAcct})
            
            truffleAssert.eventEmitted(tx, 'StoreOwnersContractDeployed', (ev) => {
                return true
            }, "StoreOwnersContractDeployed event should have been emiited.")

        })

        it("Get StoreOwners Eternal Storage Contract Address", async() => {

            let owners_storage = await owners.getEternalStorageAddress.call({from: ownerAcct})
            assert.equal(owners_storage, storage)
            // console.log("Storage", storage)
        })

        it("Verify StoreOwners Contract is One of Eternal Storage Contract Owners", async() => {

            let isOwner = await EternalStorage.at(storage).isStorageOwner.call(owners.address, {from: ownerAcct})
            assert.equal(isOwner, true)
            // console.log("Storage", storage)
        })

    })

    describe('Verify Initial Stores Contact Deployment', async () => { 

        it("Deploy Initial Stores Contract", async() => {

            stores = await Stores.deployed(manager.address);

            let tx = await manager.deployStoresContract(stores.address, {from: ownerAcct})
            
            truffleAssert.eventEmitted(tx, 'StoresContractDeployed', (ev) => {
                return true
            }, "StoresContractDeployed event should have been emiited.")

        })

        it("Get Stores Eternal Storage Contract Address", async() => {

            let stores_storage = await stores.getEternalStorageAddress.call({from: ownerAcct})
            assert.equal(stores_storage, storage)
            // console.log("Storage", storage)
        })

        it("Verify Stores Contract is One of Eternal Storage Contract Owners", async() => {

            let isOwner = await EternalStorage.at(storage).isStorageOwner.call(stores.address, {from: ownerAcct})
            assert.equal(isOwner, true)
            // console.log("Storage", storage)
        })

    })

    describe('Verify Initial Customers Contact Deployment', async () => { 

        it("Deploy Initial Customers Contract", async() => {

            customers = await Customers.deployed(manager.address);

            let tx = await manager.deployCustomersContract(customers.address, {from: ownerAcct})
            
            truffleAssert.eventEmitted(tx, 'CustomersContractDeployed', (ev) => {
                return true
            }, "CustomersContractDeployed event should have been emiited.")

        })

        it("Get Customers Eternal Storage Contract Address", async() => {

            let customers_storage = await customers.getEternalStorageAddress.call({from: ownerAcct})
            assert.equal(customers_storage, storage)
            // console.log("Storage", storage)
        })

        it("Verify Customers Contract is One of Eternal Storage Contract Owners", async() => {

            let isOwner = await EternalStorage.at(storage).isStorageOwner.call(customers.address, {from: ownerAcct})
            assert.equal(isOwner, true)
            // console.log("Storage", storage)
        })

    })

    describe('Verify Upgaded Market Contact Deployment', async () => { 

        it("Update Maket Contract", async() => {

            new_market = await Market.new(storage, {from: ownerAcct})
            // console.log("Market1", new_market.address)
            let owner = await Market.at(market).owner.call({ from: ownerAcct})
            // console.log("mOwner", owner)

            let tx = await manager.upgradeMarketContact(new_market.address, {from: ownerAcct})

            truffleAssert.eventEmitted(tx, 'MarketContractUpgraded', (ev) => {
                return true
            }, "MarketContractUpgraded event should have been emitted.")

        })

        it("Get Upgraded Market Contract Address", async() => {
        
            upg_market = await manager.getDeployedMarketContract.call({from: ownerAcct})
            assert.notEqual(upg_market, 0x0000000000000000000000000000000000000000)
            // console.log("MarketU", upg_market)
        })

        it("Get Eternal Storage Contract Owner After Upgrade", async() => {
        
            let owner = await EternalStorage.at(storage).owner.call({from: ownerAcct})
            assert.equal(owner, new_market.address)
            // console.log("sOwner1", owner)
        })

    })

})