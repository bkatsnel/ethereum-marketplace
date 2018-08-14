var MarketManager = artifacts.require("./MarketManager.sol")
var Market = artifacts.require("./Market.sol")
var StoreOwners = artifacts.require("./StoreOwners.sol")
var EternalStorage = artifacts.require("./EternalStorage.sol")

const truffleAssert = require('truffle-assertions')

contract('StoreOwners', function(accounts) {

    let manager, market, storage, state, owners
    let market_address, owners_address

    const adminAcct = accounts[0]
    const storeOwnerAcct = accounts[1]

    const storeOwnerName = "Walter"

    describe('Verify Initial Store Owners Contact Deployment', async () => { 

        it("Deploy Initial Market Contract", async() => {

            manager = await MarketManager.deployed()
            await manager.deployMarketContract({from: adminAcct})
            // console.log("Manager", manager.address)
        
            market_address = await manager.getDeployedMarketContract.call({from: adminAcct})
            assert.notEqual(market_address, "0x0000000000000000000000000000000000000000")
            // console.log("Market", market_address)   
            
            market = Market.at(market_address)
        })

        it("Deploy Initial StoreOwners Contract", async() => {

            await manager.deployStoreOwnersContract({from: adminAcct})
        
            owners_address = await manager.getDeployedStoreOwnersContract.call({from: adminAcct})
            assert.notEqual(owners_address, "0x0000000000000000000000000000000000000000")
            // console.log("Owners", owners_address)   
            
            owners = StoreOwners.at(owners_address)
        })

        it("Check StoreOwner owner", async() => {

            let owner = await owners.owner.call({from: adminAcct})
            // console.log("Owner", owner)   
            assert.equal(owner, adminAcct)

        })

    })

    describe('Perform StoreOwners Functions', async () => { 

        it("Run isStoreOwner Function", async() => {

            let isOwner = await owners.isStoreOwner.call({from: adminAcct})
            assert.equal(isOwner, false)

        })

        it("Add Store Owner", async() => {

            let tx = await owners.addStoreOwner(storeOwnerAcct, storeOwnerName, {from: adminAcct})

            truffleAssert.eventEmitted(tx, 'LogAddStoreOwner', (ev) => {
                return ev.id.toNumber() === 1 && ev.owner === storeOwnerAcct && web3.toUtf8(ev.name) === storeOwnerName
            },"LogAddStoreOwner event should have been emiited.")

        })

        it("Run getStoreOwner Function", async() => {

            let storeOwner = await owners.getStoreOwner.call(storeOwnerAcct, {from: adminAcct})
            // // console.log(storeOwner)
            assert.equal(storeOwner[0].toNumber(), 1, "First store owner id should be 1.")
            assert.equal(web3.toUtf8(storeOwner[1]), storeOwnerName, "First store owner name should be correct.")
            assert.equal(storeOwner[2].toNumber(), 0, "First store owner balance should be 0.")
            assert.equal(storeOwner[3].toNumber(), 0, "First store owner store count should be 0.")
            assert.equal(storeOwner[4].toNumber(), 0, "First store owner order count should be 0.")

        })

    })

})