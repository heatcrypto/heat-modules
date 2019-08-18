const bitcoin = require("bitcoinjs-lib")
const bip39 = require("bip39")
const bip32 = require("bip32")
const coinSelect = require('coinselect')
const Buffer = require('safe-buffer').Buffer

function ECPairFromPrivateKey(privateKeyHex) {
  var keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKeyHex,'hex'));
  return {
    privateKey: keyPair.privateKey.toString('hex'),
    publicKey: keyPair.publicKey.toString('hex'),
    wif: keyPair.toWIF()
  }
}

function ECPairFromWif(wifString) {
  var keyPair = bitcoin.ECPair.fromWIF(wifString);
  return {
    publicKey: keyPair.publicKey.toString('hex'),
    wif: keyPair.toWIF()
  }  
}

function getAddress(privateKey, type) {
  var keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey,'hex'));
  console.log('keyPair',keyPair)
  switch (type) {
    // // multi sig 1:1 
    // case 'p2sh': {
    //   const { pubKeyAddress } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    //   const { address } = bitcoin.payments.p2sh({ address: pubKeyAddress });
    //   return address;
    // }
    // standard pay to public key hash
    case 'p2pkh': {
      const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
      return address;
    }
    // // segwit (lightning address)
    // case 'bech32': {
    //   const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey })
    //   return address;
    // }
  }
  throw new Error('Unsupported address type');
}

function isValidAddress(address, type) {
  try {
    bitcoin.address.toOutputScript(address)
    return true
  } catch (e) {
    return false
  }
}

function bip39GenerateMnemonic() {
  return bip39.generateMnemonic()
}

function bip39ValidateMnemonic(value) {
  return bip39.validateMnemonic(value)
}

/**
 * Derives a batch of bip44 paths in one operation and returns all derived
 * key pairs in one go. This operation saves 
 * 
 * @param {*} mnemonic 
 * @param {*} paths 
 */
function bip44BatchDeriveKeyPairs(mnemonic, paths) {
  if (!bip39ValidateMnemonic(mnemonic))
    throw new Error('Invalid mnemonic')
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const root = bip32.fromSeed(seed)
  const result = []
  paths.forEach(path => {
    let node = root.derivePath(path)
    let privateKey = node.privateKey.toString('hex')
    let publicKey = node.publicKey.toString('hex')
    result.push([privateKey, publicKey])
  })
  return result
}

module.exports = {
  getAddress,
  isValidAddress,
  bip39GenerateMnemonic,
  bip39ValidateMnemonic,
  bip44BatchDeriveKeyPairs,
  ECPairFromPrivateKey,
  ECPairFromWif
}