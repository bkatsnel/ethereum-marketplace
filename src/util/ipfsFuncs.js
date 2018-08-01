import bs58 from 'bs58'

// IPFS cnversion functions

export function bytes32ToIPFSHash(hash_hex) {
    var buf = new Buffer(hash_hex.replace(/^0x/, '1220'), 'hex')
    return bs58.encode(buf)
};

export function ipfsHashToBytes32(ipfs_hash) {
    var hash = bs58.decode(ipfs_hash).toString('hex').replace(/^1220/, '');
    if (hash.length !== 64) {
        console.log('invalid ipfs format', ipfs_hash, hash);
        return null;
    }
    return '0x' + hash;
};

export function ipfsAddFile(ipfs, contents) {

    ipfs.add([Buffer.from(contents)], (err, res) => {
        if (err) throw err
        console.log('Ipfs Result', res)
        const hash = res[0].hash
        return hash
    })

}

export function readIpfsFile(ipfs, hash) {

    ipfs.cat(hash, (err, res) => {
        if (err) throw err
        let data = ''
        res.on('data', (d) => data += d)
        res.on('end', () => { return data })
    })

}

