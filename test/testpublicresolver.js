const ENS = artifacts.require('ENSRegistry.sol')
const PublicResolver = artifacts.require('PublicResolver.sol')
const ReverseRegistrar = artifacts.require('ReverseRegistrar.sol');

const utils = require('./helpers/Utils.js')
const namehash = require('eth-ens-namehash')

contract('PublicResolver', function (accounts) {

    let node
    let ens, resolver, reverseresolver

    let customers = [ 'bob' ]
    let nameSuff = 'olmarket'
    let offset = 2
    let tld = 'eth'

    beforeEach(async () => {
        node = namehash.hash(tld)
        ens = await ENS.deployed()
        resolver = await PublicResolver.deployed()
        reverseresolver = await ReverseRegistrar.deployed();
        await ens.setSubnodeOwner(0, web3.sha3(tld), accounts[0], {from: accounts[0]})
    })

    describe('Testing addr functionality', async () => {

        it('Permits setting address by owner', async () => {
            await resolver.setAddr(node, accounts[0], {from: accounts[0]})
            assert.equal(await resolver.addr(node), accounts[0])
        })
        
        for (let i=0; i < customers.length; i++) {

            let ind = i + offset
            let custName, custNode

            it('Permits setting address by customers', async () => {

                custName = customers[i].toLowerCase() + '-' + nameSuff
                custNode = namehash.hash(`${custName}.${tld}`)

                await ens.setSubnodeOwner(node, web3.sha3(custName), accounts[ind], {from: accounts[0]})
                // await ens.setResolver(custNameHash, resolver, {from: accounts[ind]});

            })

            it('Verify address set by customer', async () => {

                await resolver.setAddr(custNode, accounts[ind], {from: accounts[ind]})
                assert.equal(await resolver.addr(custNode), accounts[ind])

            })

            it('Permits setting reverse address by customers', async () => {

                await reverseresolver.setName(`${custName}.${nameSuff}.eth`, { from: accounts[i]});
                let res = await resolver.name.call(namehash.hash(`${accounts[i].slice(2)}.addr.reverse`));
                // console.log(res, '==', `${custName}.${nameSuff}.${tld}`)
                assert.equal(res, `${custName}.${nameSuff}.${tld}`)

            })

        }
    })

})