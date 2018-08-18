var MarketManager = artifacts.require("./MarketManager.sol")
var Market = artifacts.require("./Market.sol")
var StoreOwners = artifacts.require("./StoreOwners.sol")
var Stores = artifacts.require("./Stores.sol")

const truffleAssert = require('truffle-assertions')
const bs58 = require('bs58')

contract('Stores', function(accounts) {

    let manager, owners, stores
    let market_address, owners_address, stores_address

    const adminAcct = accounts[0]
    const storeOwnerAcct = accounts[1]

    const storeOwnerName = "Walter"
    const petStore = "Pet Store"
    const petProduct = "Gold Fish"

    const bytes32ToIPFSHash = hash_hex => {
        var buf = new Buffer(hash_hex.replace(/^0x/, '1220'), 'hex')
        return bs58.encode(buf)
    }
    
    const ipfsHashToBytes32 = ipfs_hash => {
        var hash = bs58.decode(ipfs_hash).toString('hex').replace(/^1220/, '')
        if (hash.length != 64) {
            console.log('invalid ipfs format', ipfs_hash, hash)
            return null
        }
        return '0x' + hash
    }

    // Convert sid to bytes32

    const petStoreCid = "Qmc9SfFFqzusMP7h9QNpgxuByhzYYKL68YREVmJU4bYjJb"
    const petStoreDescHash = ipfsHashToBytes32(petStoreCid)

    describe('Verify Initial Store Contact Deployment', async () => { 

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

            owners = await StoreOwners.deployed(manager.address)
            await manager.deployStoreOwnersContract(owners.address, {from: adminAcct})
        
            owners_address = await manager.getDeployedStoreOwnersContract.call({from: adminAcct})
            assert.equal(owners_address, owners.address)
            // console.log("Owners", owners_address)   
            
        })

        it("Deploy Initial Stores Contract", async() => {

            stores = await Stores.deployed(manager.address);
            await manager.deployStoresContract(stores.address, {from: adminAcct})
        
            stores_address = await manager.getDeployedStoresContract.call({from: adminAcct})
            assert.equal(stores_address, stores.address)
            // console.log("Owners", owners_address)   
            
        })

        it("Check Stores StoreOwners Address", async() => {

           let stores_owners_addres = await stores.getStoreOwnersContractAddress.call({from: storeOwnerAcct})
           assert.equal(stores_owners_addres, owners_address)
        
        })

        it("Check Stores owner", async() => {

            let owner = await stores.owner.call({from: adminAcct})
            // console.log("Owner", owner)   
            assert.equal(owner, manager.address)

        })

    })

    describe('Perform Stores Functions', async () => { 

        it("Add Store Owner", async() => {

            let tx = await owners.addStoreOwner(storeOwnerAcct, storeOwnerName, {from: adminAcct})

            truffleAssert.eventEmitted(tx, 'LogAddStoreOwner', (ev) => {
                return ev.id.toNumber() === 1 && ev.owner === storeOwnerAcct && web3.toUtf8(ev.name) === storeOwnerName
            },"LogAddStoreOwner event should have been emiited.")

        })

        it("Verify Store Owner", async() => {

            let isOwner = await owners.isStoreOwner({from: storeOwnerAcct})
            assert.equal(isOwner, true)

        })

        it("Add Store", async() => {

            let tx = await stores.addStore(petStore, petStoreDescHash, {from: storeOwnerAcct})

            truffleAssert.eventEmitted(tx, 'LogAddStore', (ev) => {
                return web3.toUtf8(ev.name) === petStore && ev.owner === storeOwnerAcct
              },"LogAddStore event should have been emiited.")

        })

        it("Get store", async() => {

            let store = await stores.getStore.call(petStore, {from: storeOwnerAcct})
            
            assert.equal(web3.toUtf8(store[0]), petStore, "Store name should be correct.")
            assert.equal(store[1], storeOwnerAcct, "Store owner accunt should be correct.")
            assert.equal(bytes32ToIPFSHash(store[3]), petStoreCid, "Store hash should be correct.")
        })

    })

    describe('Verify Store Product Functions', async () => { 

        let tx
        let id = 1, quantity = 10, price = 50
    
        it("Add store product", async() => {
          tx = await stores.addStoreProduct(petStore, id, quantity, price, petProduct, {from: storeOwnerAcct})

          truffleAssert.eventEmitted(tx, 'LogAddStoreProduct', (ev) => {
            return web3.toUtf8(ev.name) === petStore && web3.toUtf8(ev.description) === petProduct
          },"LogAddStoreProduct event should have been emiited.")
        })
    
        it("Get store product", async() => {
     
          let product = await stores.getStoreProduct.call(petStore, id, {from: storeOwnerAcct})
    
          assert.equal(product[0].toNumber(), id, "First store product id should be 1.")
          assert.equal(product[1].toNumber(), quantity, "First store product quantity should be 10.")
          assert.equal(product[2].toNumber(), price, "First store product price should be 50.")
          assert.equal(web3.toUtf8(product[3]), petProduct, "First store product should have correct description.")
    
        })
    
      })

})