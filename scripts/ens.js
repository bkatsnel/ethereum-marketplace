const ENSRegistry = artifacts.require('ENSRegistry.sol');
const PublicResolver = artifacts.require('PublicResolver.sol');
const ReverseRegistrar = artifacts.require('ReverseRegistrar.sol');
const namehash = require('eth-ens-namehash');
const yargs = require('yargs');

let arg = yargs
    .usage('Usage: truffle exec scripts/ens.js -n $DOMAIN_NAME -a $ADDRESS')
    // avoid address to hex conversion
    .coerce(['a'], function (arg) { return arg})
    .demandOption(['n', 'a'])
    .argv;

let name = arg.n;
let tld = 'eth';
let hashedname = namehash.hash(`${name}.eth`);

let customers = [ "Bob", "Jane", "Bill" ]

module.exports = async (callback) =>  {

    let ens = await ENSRegistry.deployed();
    let resolver = await PublicResolver.deployed();
    let reverseresolver = await ReverseRegistrar.deployed();

    console.log('3 ENS Contracts deployed.\n')
    // console.log("Ens", ens)
    let owner = web3.eth.accounts[0];
    // console.log('owner', owner)
    let addresses = web3.eth.accounts.slice(arg.a, Number(arg.a) + customers.length);

    try {

        await ens.setSubnodeOwner(0, web3.sha3(tld), owner, {from: owner})
        await ens.setSubnodeOwner(namehash.hash(tld), web3.sha3(name), owner, {from: owner})

        console.log(`Owners are set for ${tld} and ${name}.${tld}\n`)

        await ens.setResolver(hashedname, PublicResolver.address, {from: owner});

        await resolver.setAddr(hashedname, owner, {from: owner})
        let res1 = await resolver.addr.call(hashedname);
        console.log(res1, '==', owner)

        await reverseresolver.setName(`${name}.eth`, { from: owner});
        let res2 = await resolver.name.call(namehash.hash(`${owner.slice(2)}.addr.reverse`));
        console.log(res2, '==', `${name}.eth`)

        let custName, custNameHash

        for (let i = 0; i < customers.length; i++) {

            custName = customers[i].toLowerCase()
            custNameHash = namehash.hash(`${custName}.${name}.eth`)

            await ens.setSubnodeOwner(hashedname, web3.sha3(custName), addresses[i], {from: owner})
            await ens.setResolver(custNameHash, PublicResolver.address, {from: addresses[i]});

            await resolver.setAddr(custNameHash, addresses[i], {from: addresses[i]})
            res1 = await resolver.addr.call(custNameHash);
            console.log(res1, '==', addresses[i])

            await reverseresolver.setName(`${custName}.${name}.eth`, { from: addresses[i]});
            res2 = await resolver.name.call(namehash.hash(`${addresses[i].slice(2)}.addr.reverse`));
            console.log(res2, '==', `${custName}.${name}.eth`)

        }

    } catch(err) {

        console.log(err)

    }

}