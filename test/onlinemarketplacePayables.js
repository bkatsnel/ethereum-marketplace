var OnlineMarketplace = artifacts.require("./OnlineMarketplace.sol");
const truffleAssert = require('truffle-assertions');
const bs58 = require('bs58');

contract('OnlineMarketplace', function(accounts) {

  let marketplace;

  //Define Variables to Use For Tests

  const adminAcct = accounts[0];
  const storeOwnerAcct = accounts[1];
  const customerAcct = accounts[3];

  const storeOwnerName = "Walter";
  const petStore = "Pet Store";
  const petProduct = "Gold Fish";

  const id = 1, quantity = 10, price = 50, orderQuantity = 1, payment = 60;
  const name = "Joe", homeAddress = "1 Main Road";

  // IPFS cnversion functions

  const bytes32ToIPFSHash = hash_hex => {
    var buf = new Buffer(hash_hex.replace(/^0x/, '1220'), 'hex')
    return bs58.encode(buf)
  };

  const ipfsHashToBytes32 = ipfs_hash => {
    var hash = bs58.decode(ipfs_hash).toString('hex').replace(/^1220/, '');
    if (hash.length != 64) {
        console.log('invalid ipfs format', ipfs_hash, hash);
        return null;
    }
    return '0x' + hash;
  };

  // Convert sid to bytes32

  const petStoreCid = "Qmc9SfFFqzusMP7h9QNpgxuByhzYYKL68YREVmJU4bYjJb";
  const petStoreDescHash = ipfsHashToBytes32(petStoreCid);

  //
  // Before And After Each Test Functions
  //

  beforeEach(async () => {
    // Create New Contract
    marketplace = await OnlineMarketplace.new({from: adminAcct});
    assert.equal(web3.eth.getBalance(marketplace.address).toNumber(), 0);
 
    // Set Store And Product
    await marketplace.addStoreOwner(storeOwnerAcct, storeOwnerName, {from: adminAcct});
    await marketplace.addStore(petStore, petStoreDescHash, {from: storeOwnerAcct});
    await marketplace.addStoreProduct(petStore, id, quantity, price, petProduct, {from: storeOwnerAcct});
    //Sign Up Customer
    await marketplace.signUp(name, homeAddress, {from: customerAcct});
  });

  afterEach(async () => {
    await marketplace.destroy({from: adminAcct});
  });

  it ("Test Customer Order", async() => {
    // Place Order 
    let tx = await marketplace.placeOrder(petStore, id, orderQuantity, price, {value: payment, from: customerAcct});
    // Verify Order Has Been Placed
    truffleAssert.eventEmitted(tx, 'LogCustomerOrder', (ev) => {
      return web3.toUtf8(ev.name) === petStore && ev.customer === customerAcct && ev.id.toNumber() === id;
     },"LogCustomerOrder (name filter) event should have been emitted.");
    // Verify Order Has Been Placed Based on Store owner
    truffleAssert.eventEmitted(tx, 'LogCustomerOrder', (ev) => {
      return ev.owner === storeOwnerAcct;
      },"LogCustomerOrder (owner filter) event should have been emitted.");
    // Check owner balance
    let owner = await marketplace.getOwnerInfo.call({from: storeOwnerAcct});
    assert.equal(owner[2].toNumber(), orderQuantity * price, "Verify Customer Balance.");
    // Varify Store Funds
    let store = await marketplace.getStore.call(petStore, {from: storeOwnerAcct})
    assert.equal(store[2].toNumber(), orderQuantity * price, "Verify Store Funds.")
    // Check Customer Balance
    let customer = await marketplace.getCustomerInfo.call({from: customerAcct});
    assert.equal(customer[2].toNumber(), payment - orderQuantity * price, "Verify Customer Balance.");
  })

  it ("Test Owner Store Funds Withdrawal", async() => {
    // Place Order 
    await marketplace.placeOrder(petStore, id, orderQuantity, price, {value: payment, from: customerAcct});
    // Place Order 
    let tx = await marketplace.withdrawStoreFunds(petStore, {from: storeOwnerAcct});
    // Verify Withdrawal Has Been made
    truffleAssert.eventEmitted(tx, 'LogOwnerWithdrawal', (ev) => {
    return web3.toUtf8(ev.name) === petStore && ev.owner === storeOwnerAcct && ev.amount.toNumber() === orderQuantity * price;
    },"LogOwnerWithdrawal event should have been emitted.");
    // Check owner balance
    let owner = await marketplace.getOwnerInfo.call({from: storeOwnerAcct});
    assert.equal(owner[2].toNumber(), 0, "Verify Customer Balance.");
    // Varify Store Funds
    let store = await marketplace.getStore.call(petStore, {from: storeOwnerAcct})
    assert.equal(store[2].toNumber(), 0, "Verify Store Funds.")
  })

  it ("Test Customer Balance Withdrawal", async() => {
    // Place Order 
    await marketplace.placeOrder(petStore, id, orderQuantity, price, {value: payment, from: customerAcct});
    // Place Order 
    let tx = await marketplace.withdrawCustomerBalance({from: customerAcct});
    // Verify Withdrawal Has Been made
    truffleAssert.eventEmitted(tx, 'LogCustomerWithdrawal', (ev) => {
    return ev.customer === customerAcct && ev.amount.toNumber() === payment - orderQuantity * price;
    },"LogCustomerWithdrawal event should have been emitted.");
    // Check Customer Balance
    let customer = await marketplace.getCustomerInfo.call({from: customerAcct});
    assert.equal(customer[2].toNumber(), 0, "Verify Customer Balance.");
  })

})