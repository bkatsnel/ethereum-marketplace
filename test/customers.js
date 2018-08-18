var MarketManager = artifacts.require("./MarketManager")
var Market = artifacts.require("./Market")
var StoreOwners = artifacts.require("./StoreOwners")
var Stores = artifacts.require("./Stores")
var Customers = artifacts.require("./Customers")

const truffleAssert = require('truffle-assertions')
const bs58 = require('bs58')

contract('Customers', function(accounts) {

    let manager, owners, stores, customers, market

    const adminAcct = accounts[0]
    const storeOwnerAcct = accounts[1]
    const customerAcct = accounts[2]

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

        it("Deploy Initial Customers Contract", async() => {

            customers = await Customers.deployed(manager.address);
            await manager.deployCustomersContract(customers.address, {from: adminAcct})
        
            customers_address = await manager.getDeployedCustomersContract.call({from: adminAcct})
            assert.equal(customers_address, customers.address)
            // console.log("Owners", owners_address)   
            
        })

        it("Check Customers Stores Address", async() => {

           let customers_stores_address = await customers.getStoresContractAddress.call({from: adminAcct})
           assert.equal(customers_stores_address, stores.address)
        
        })

        it("Check Customers owner", async() => {

            let owner = await customers.owner.call({from: adminAcct})
            // console.log("Owner", owner)   
            assert.equal(owner, manager.address)

        })

    })

    describe('Perform Store OwnerssFunctions', async () => { 

        it("Add Store Owner", async() => {

            let tx = await owners.addStoreOwner(storeOwnerAcct, storeOwnerName, {from: adminAcct})

            truffleAssert.eventEmitted(tx, 'LogAddStoreOwner', (ev) => {
                return ev.id.toNumber() === 1 && ev.owner === storeOwnerAcct && web3.toUtf8(ev.name) === storeOwnerName
            },"LogAddStoreOwner event should have been emiited.")

        })
    
    })

    describe('Perform Stores Functions', async () => { 

        it("Add Store", async() => {

            let tx = await stores.addStore(petStore, petStoreDescHash, {from: storeOwnerAcct})

            truffleAssert.eventEmitted(tx, 'LogAddStore', (ev) => {
                return web3.toUtf8(ev.name) === petStore && ev.owner === storeOwnerAcct
              },"LogAddStore event should have been emiited.")

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
    
    })

    describe('Verify Customer Functions', async () => { 

        let tx
        let name = "Joe", homeAddress = "1 Main Road", initBalance=0
    
        it ("Sign Up Customer", async() =>{

          tx = await customers.signUp(name, homeAddress, {from: customerAcct})
        
          truffleAssert.eventEmitted(tx, 'LogAddCustomer', (ev) => {
            return web3.toUtf8(ev.name) === name && web3.toUtf8(ev.homeAddress) === homeAddress
          },"LogAddCustomer event should have been emiited.")
    
        })
    
        it ("Check Customer Info", async() => {
    
          let customer = await customers.getCustomerInfo.call({from: customerAcct})
          
          assert.equal(web3.toUtf8(customer[0]), name, "Verify Customer Name.")
          assert.equal(web3.toUtf8(customer[1]), homeAddress, "Verify Customer Address.")
          assert.equal(customer[2].toNumber(), initBalance, "Verify Customer Initial Balance.")
          assert.equal(customer[3].toNumber(), 0, "Verify Customer Initial Orders.")
          assert.equal(customer[4].toNumber(), 0, "Verify Customer Initial Withdrawals.")
    
      })
    
      it ("Check Customer Login Process", async() =>{
       
          let account_type = await market.login.call({from: customerAcct})
          assert.equal(web3.toUtf8(account_type), "customer", "Verify Customer Account Type.")
    
      })


    })

    describe('Verify Customer Order Functions', async () => { 

        let id = 1,  price = 50, orderQuantity = 1
        let payment = orderQuantity * price + 10

        it ("Test Customer Order", async() => {

            // Place Order 
            let tx = await customers.placeOrder(petStore, id, orderQuantity, price, {value: payment, from: customerAcct});
            // Verify Order Has Been Placed
            truffleAssert.eventEmitted(tx, 'LogCustomerOrder', (ev) => {
                return web3.toUtf8(ev.name) === petStore && ev.customer === customerAcct && ev.id.toNumber() === id;
            },"LogCustomerOrder (name filter) event should have been emitted.");
        })

        it ("Verify Store Owner Balance", async() => {

            // Check owner balance
            let owner = await owners.getStoreOwner.call(storeOwnerAcct, {from: storeOwnerAcct});
            assert.equal(owner[0].toNumber(), 1, "Verify Store Owner Id.");
            assert.equal(owner[2].toNumber(), orderQuantity * price, "Verify Store Owner Balance.");
        
        })

        it ("Verify Store Balance", async() => {

            // Varify Store Funds
            let store = await stores.getStore.call(petStore, {from: storeOwnerAcct})
            assert.equal(store[2].toNumber(), orderQuantity * price, "Verify Store Funds.")

        })

        it ("Verify Customer Balance", async() => {

            // Check Customer Balance
            let customer = await customers.getCustomerInfo.call({from: customerAcct});
            assert.equal(customer[2].toNumber(), payment - orderQuantity * price, "Verify Customer Balance.");

        })

        it ("Verify Customers Contract Balance", async() => {

            // Check Customer Balance
            let balance = await customers.getBalance.call({from: customerAcct});
            assert.equal(balance.toNumber(), payment, "Verify Customers Contracts Balance.");

        })

        it ("Test Customer Balance Withdrawal", async() => {
            // Place Order 
            // Place Order 
            let tx = await customers.withdrawCustomerBalance({from: customerAcct});
            // Verify Withdrawal Has Been made
            truffleAssert.eventEmitted(tx, 'LogCustomerWithdrawal', (ev) => {
                return ev.customer === customerAcct && ev.amount.toNumber() === payment - orderQuantity * price;
            },"LogCustomerWithdrawal event should have been emitted.");
        })

        it ("Test Customer Balance After Withdrawal", async() => {
            // Check Customer Balance
            let customer = await customers.getCustomerInfo.call({from: customerAcct});
            assert.equal(customer[2].toNumber(), 0, "Verify Customer Balance.");
        })

    })
    
})