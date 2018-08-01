var OnlineMarketplace = artifacts.require("./OnlineMarketplace.sol")
const truffleAssert = require('truffle-assertions')
const bs58 = require('bs58')

contract('OnlineMarketplace', function(accounts) {

  let marketplace
  const adminAcct = accounts[0]
  const storeOwnerAcct = accounts[1]
  const storeOwnerAcct1 = accounts[2]
  const customerAcct = accounts[3]

  const storeOwnerName = "Walter"
  const storeOwnerName1 = "Joe"
  const petStore = "Pet Store"
  const petProduct = "Gold Fish"

  // IPFS cnversion functions

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

  //
  // Before And After Each Test Functions
  //

  beforeEach(async () => {
    marketplace = await OnlineMarketplace.new({from: adminAcct})
    assert.equal(web3.eth.getBalance(marketplace.address).toNumber(), 0)
  })

  afterEach(async () => {
    await marketplace.destroy({from: adminAcct})
  })

  //
  // Tests Begin Here
  //

  describe('Verify Basic Administrator Functions', async () => { 

    it("Get Contract Creation Block", async() => {
      let blockNo = await marketplace.getBlockCreated.call({from: adminAcct})
      assert.notEqual(blockNo.toNumber(), 0 , "Contract block creation should not be 0.")
    })

    it("Login As Administrator", async() => {
      let account_type = await marketplace.login.call({from: adminAcct})
      assert.equal(web3.toUtf8(account_type), "admin", "Administrator account type should be admin.")
    })

  })

  describe('Verify Store Owner Functions', async () => { 

    let tx

    beforeEach(async () => {
      tx = await marketplace.addStoreOwner(storeOwnerAcct, storeOwnerName, {from: adminAcct})
    })

    it("Add store owner", async() => {
        truffleAssert.eventEmitted(tx, 'LogAddStoreOwner', (ev) => {
          return ev.id.toNumber() === 1 && ev.owner === storeOwnerAcct && web3.toUtf8(ev.name) === storeOwnerName
        },"LogAddStoreOwner event should have been emiited.")
    })

    it("Check store owner", async() => {
        let res = await marketplace.isStoreOwner.call({from: storeOwnerAcct})
        assert.equal(res, true, "Check store owner should be true.")
    })

    it("Get store owner info", async() => {
        let res = await marketplace.getOwnerInfo.call({from: storeOwnerAcct})
        assert.equal(res[0].toNumber(), 1, "First store owner id should be 1.")
    })

    it("Get store owner", async() => {
        let res = await marketplace.getStoreOwner.call(storeOwnerAcct,{from: adminAcct})
        assert.equal(res[0].toNumber(), 1, "First store owner id should be 1.")
    })

    it("Event store owner", async() => {
      truffleAssert.eventEmitted(tx, 'LogAddStoreOwner', (ev) => {
        return web3.toUtf8(ev.name) === storeOwnerName
      },"LogAddStoreOwner event should have been emiited.")
    })

  })

  describe('Verify Store Functions', async () => { 

    let tx

    beforeEach(async () => {
      await marketplace.addStoreOwner(storeOwnerAcct, storeOwnerName, {from: adminAcct})
      tx = await marketplace.addStore(petStore, petStoreDescHash, {from: storeOwnerAcct})
    })

    it("Add store", async() => {
      truffleAssert.eventEmitted(tx, 'LogAddStore', (ev) => {
        return web3.toUtf8(ev.name) === petStore && ev.owner === storeOwnerAcct
      },"LogAddStoreOwner event should have been emiited.")
    })

    it("Get store", async() => {
      const res = await marketplace.getStore.call(petStore, {from: storeOwnerAcct})

      assert.equal(web3.toUtf8(res[0]), petStore, "Store name should be correct.")
      assert.equal(bytes32ToIPFSHash(res[4]), petStoreCid, "Store hash should be correct.")
    })

  })

  describe('Verify Store Product Functions', async () => { 

    let tx
    let id = 1, quantity = 10, price = 50

    beforeEach(async () => {
      await marketplace.addStoreOwner(storeOwnerAcct, storeOwnerName, {from: adminAcct})
      await marketplace.addStore(petStore, petStoreDescHash, {from: storeOwnerAcct})
      tx = await marketplace.addStoreProduct(petStore, id, quantity, price, petProduct, {from: storeOwnerAcct})
    })

    it("Add store product", async() => {
      truffleAssert.eventEmitted(tx, 'LogAddStoreProduct', (ev) => {
        return web3.toUtf8(ev.name) === petStore && web3.toUtf8(ev.description) === petProduct
      },"LogAddStoreProduct event should have been emiited.")
    })

    it("Get store product", async() => {
 
      let res = await marketplace.getStoreProduct.call(petStore, id, {from: storeOwnerAcct})

      assert.equal(res[0].toNumber(), id, "First store product id should be 1.")
      assert.equal(res[1].toNumber(), quantity, "First store product quantity should be 10.")
      assert.equal(res[2].toNumber(), price, "First store product price should be 50.")
      assert.equal(web3.toUtf8(res[3]), petProduct, "First store product should have correct description.")

    })

  })

  describe('Verify Customer Functions', async () => { 

    let tx
    let name = "Joe", homeAddress = "1 Main Road", initBalance=0

    beforeEach(async () => {
      tx = await marketplace.signUp(name, homeAddress, {from: customerAcct})
    })

    it ("Sign Up Customer", async() =>{
      truffleAssert.eventEmitted(tx, 'LogAddCustomer', (ev) => {
        return web3.toUtf8(ev.name) === name && web3.toUtf8(ev.homeAddress) === homeAddress
      },"LogAddCustomer event should have been emiited.")

    })

    it ("Check Customer Info", async() => {

      let res = await marketplace.getCustomerInfo.call({from: customerAcct})
      
      assert.equal(web3.toUtf8(res[0]), name, "Verify Customer Name.")
      assert.equal(web3.toUtf8(res[1]), homeAddress, "Verify Customer Address.")
      assert.equal(res[2].toNumber(), initBalance, "Verify Customer Initial Balance.")

  })

  it ("Check Customer Login Process", async() =>{
   
      let account_type = await marketplace.login.call({from: customerAcct})
      assert.equal(web3.toUtf8(account_type), "customer", "Verify Customer Account Type.")

      let res = await marketplace.getCustomerInfo.call({from: customerAcct})
      
      assert.equal(web3.toUtf8(res[0]), name, "Verify Customer Name.")
      assert.equal(web3.toUtf8(res[1]), homeAddress, "Verify Customer Address.")

    })

  })

})
