var MarketManager = artifacts.require("./MarketManager.sol")
var Market = artifacts.require("./Market.sol")
var EternalStorage = artifacts.require("./EternalStorage.sol")

const truffleAssert = require('truffle-assertions')

contract('Market', function(accounts) {

    let manager, market, storage, paused

    const ownerAcct = accounts[0]
    const adminAcct = accounts[1]

    describe('Verify Initial Market Contact Deployment', async () => { 

        it("Deploy Initial Market Contract", async() => {

            manager = await MarketManager.deployed()
            await manager.deployMarketContract({from: ownerAcct})
            // console.log("Manager", manager.address)
        
            let market_address = await manager.getDeployedMarketContract.call({from: ownerAcct})
            assert.notEqual(market_address, "0x0000000000000000000000000000000000000000")
            // console.log("Market", market_address)   
            
            market = Market.at(market_address)
        })

        it("Storage Address Should be set", async() => {
            storage = await market.getEternalStorageAddress.call({from: ownerAcct})
            assert.notEqual(storage, "0x0000000000000000000000000000000000000000")
            // console.log("Storage", storage)
        })

        it("Owner should be accouns[0]", async() => {
            let owner = await market.owner.call({from: ownerAcct})
            assert.equal(owner, ownerAcct, "Owner should be account[0].")
            // console.log("Owner", owner)
        })
        
        it("Owner should be added to administrators", async() => {
            let response = await market.isAdministrator.call({from: ownerAcct})
            assert.equal(response, true, "Owner should be administrator.")
        })

    })

    describe('Verify Emercency Stop Functions', async () => { 

        it("Verify Inital State is Active", async() => {
            paused = await market.paused.call({from: ownerAcct})
            assert.equal(paused, false, "Contract should not be paused when created.")
            // console.log('State', state.toNumber())
        })
        
        it("Pause Contract", async() => {
            await market.pause({from: ownerAcct})
            paused = await market.paused.call({from: ownerAcct})
            assert.equal(paused, true, "Contract should be paused after pause request.")
        })
    
        it("UnPause Contract", async() => {
            await market.unpause({from: ownerAcct})
            paused = await market.paused.call({from: ownerAcct})
            assert.equal(paused, false, "Contract should not be paused after unpause created.")
        })
    
    })

    describe('Verify Administrator Functions', async () => { 

        it("Add adminAcct to administrators", async() => {
    
            let tx = await market.addAdministrator(adminAcct, {from: ownerAcct})
    
            truffleAssert.eventEmitted(tx, 'LogAddAdministrator', (ev) => {
              return ev.admin === adminAcct && ev.index.toNumber() > 0
            },"LogAddAdministrator event should have been emiited.")
    
        })
    
        it("Check adminAcct call to isAdministrator", async() => {
    
            let res = await market.isAdministrator.call({from: adminAcct})
            assert(res, true, "adminAcct should be administrator.")
    
        })
    
        it("Get adminAcct Administrator Id", async() => {
    
            let id =  await market.getAdministrator.call(adminAcct, {from: adminAcct})
            assert(id.toNumber(), 3, "adminAccta administrator id should return id of 3.")
    
        })

        it("Get Manager Administrator Id", async() => {
    
            let id =  await market.getAdministrator.call(manager.address, {from: adminAcct})
            assert(id.toNumber(), 1, "Manager administrator id should return id of 1.")
        
        })

    })

})