var EternalStorage = artifacts.require("./EternalStorage.sol")

// const truffleAssert = require('truffle-assertions')

contract('EternalStorage', function(accounts) {

  let eternalStorage
  const ownerAcct = accounts[0]

//   beforeEach(async () => {
//     eternalStorage = await EternalStorage.deployed()
//     console.log("Storage", eternalStorage.address)
//   })

//   afterEach(async () => {
//     await eternalStorage.destroy({from: ownerAcct})
//   })

  describe('Verify Contract Owner', async () => { 

    beforeEach(async () => {
        eternalStorage = await EternalStorage.deployed()
        // console.log("Storage", eternalStorage.address)
    })
    
    it("Initial balance should be 0", async() => {
        assert.equal(web3.eth.getBalance(eternalStorage.address).toNumber(), 0)
    })

    it("Contract owner should be accouny[0]", async() => {
        let owner = await eternalStorage.owner.call({from: ownerAcct})
        // console.log('Owner', owner)
        assert.equal(owner, ownerAcct)
    })

  })

})