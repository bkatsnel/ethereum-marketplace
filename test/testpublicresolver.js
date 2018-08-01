const ENS = artifacts.require('ENSRegistry.sol')
const PublicResolver = artifacts.require('PublicResolver.sol')

const utils = require('./helpers/Utils.js')
const namehash = require('eth-ens-namehash')

contract('PublicResolver', function (accounts) {

    let node
    let ens, resolver

    let customers = [ 'bob' ]
    let nameSuff = 'olmarket'
    let offset = 2
    let tld = 'eth'

    beforeEach(async () => {
        node = namehash.hash(tld)
        ens = await ENS.new()
        resolver = await PublicResolver.new(ens.address)
        await ens.setSubnodeOwner(0, web3.sha3(tld), accounts[0], {from: accounts[0]})
    })

    describe('Testing addr functionality', async () => {

        it('permits setting address by owner', async () => {
            await resolver.setAddr(node, accounts[0], {from: accounts[0]})
            assert.equal(await resolver.addr(node), accounts[0])
        })
        
        for (let i=0; i < customers.length; i++) {

            let ind = i + offset

            it('permits setting address by customers', async () => {

                let custName = customers[i].toLowerCase() + '-' + nameSuff
                let custNode = namehash.hash(`${custName}.${tld}`)

                await ens.setSubnodeOwner(node, web3.sha3(custName), accounts[ind], {from: accounts[0]})
                // await ens.setResolver(custNameHash, resolver, {from: accounts[ind]});

                await resolver.setAddr(custNode, accounts[ind], {from: accounts[ind]})
                assert.equal(await resolver.addr(custNode), accounts[ind])

            })

        }
    })

})