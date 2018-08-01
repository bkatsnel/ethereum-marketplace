var Administerable = artifacts.require("./Administerable.sol")
const truffleAssert = require('truffle-assertions')

contract('Administerable', function(accounts) {

  let AdministerableInstance
  const ownerAcct = accounts[0]
  const adminAcct = accounts[1]

  beforeEach(async () => {
    AdministerableInstance = await Administerable.new({from: ownerAcct})
    assert.equal(web3.eth.getBalance(AdministerableInstance.address).toNumber(), 0)
  })

  afterEach(async () => {
    await AdministerableInstance.destroy({from: ownerAcct})
  })

  describe('Verify Initial Contract State', async () => { 

    it("Initial state should be Active(0)", async() => {
      let state = await AdministerableInstance.getState.call({from: ownerAcct})
      assert.equal(state, 0, "State should be 0 meaning Active.")
    })

    it("Owner should be added to administrators", async() => {
        let response = await AdministerableInstance.isAdministrator.call({from: ownerAcct})
        assert.equal(response, true, "Owner should be administrator.")
    })

  })

  describe('Verify Emercency Stop Functions', async () => { 

    it("Lock Contract", async() => {
      await AdministerableInstance.lock({from: ownerAcct})
      let state = await AdministerableInstance.getState.call({from: ownerAcct})
      assert.equal(state, 1, "State should be 1 meaning Locked.")
    })

    it("Unlock Contract", async() => {
      await AdministerableInstance.lock({from: ownerAcct})
      let state = await AdministerableInstance.getState.call({from: ownerAcct})
      assert.equal(state, 1, "State should be 1 meaning Locked.")
      await AdministerableInstance.unlock({from: ownerAcct})
      state = await AdministerableInstance.getState.call({from: ownerAcct})
      assert.equal(state, 0, "State should be 0 meaning Active.")
    })

  })

  describe('Verify Administrator Functions', async () => { 

    it("Add adminAcct to administrators", async() => {

        let tx = await AdministerableInstance.addAdministrator(adminAcct, {from: ownerAcct})

        truffleAssert.eventEmitted(tx, 'LogAddAdministrator', (ev) => {
          return ev.admin === adminAcct && ev.index.toNumber() === 2
        },"LogAddAdministrator event should have been emiited.")

        let id = await AdministerableInstance.getAdministrator(adminAcct)
        assert.equal(id.toNumber(), 2, "adminAcct administrator id should be 2.")
    })

    it("Check adminAcct call to isAdministrator", async() => {

        await AdministerableInstance.addAdministrator(adminAcct, {from: ownerAcct})
        let res = await AdministerableInstance.isAdministrator.call({from: adminAcct})
        assert(res, true, "adminAcct should be administrator.")

    })

    it("Get adminAcct Administrator Id", async() => {

      await AdministerableInstance.addAdministrator(adminAcct, {from: ownerAcct})
      let id =  await AdministerableInstance.getAdministrator.call(adminAcct, {from: adminAcct})
      assert(id.toNumber(), 2, "adminAccta get administrator should return id of 2.")

    })

  })

})
