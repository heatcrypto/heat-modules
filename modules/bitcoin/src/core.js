const _ = require('lodash')
const bitcoin = require('@trezor/utxo-lib')
const bip39 = require("bip39")
const bip32 = require("bip32")
const coinSelect = require('coinselect')
const coinSelectSplit = require('coinselect/split')
const Buffer = require('safe-buffer').Buffer
const cashaddr = require('bchaddrjs')

// So we need to always use the proper network when dealing with keys and addresses
// https://github.com/bitcoinjs/bitcoinjs-lib/issues/1223
// https://en.bitcoin.it/wiki/List_of_address_prefixes

function isHex(h) {
  return Boolean(h.match(/^[0-9a-f]+$/i))
}

function getAddress(privateKeyOrWif, type, networkId) {
  const network = bitcoin.networks[networkId];
  if (_.isUndefined(network)) throw new Error(`network not supported [${networkId}] supported networks [${Object.keys(bitcoin.networks).join(',')}]`);
  if (!_.isString(privateKeyOrWif)) throw new Error('Private key not a string');

  var keyPair = isHex(privateKeyOrWif) ? 
    bitcoin.ECPair.fromPrivateKeyBuffer(Buffer.from(privateKeyOrWif, 'hex'), network) : 
    bitcoin.ECPair.fromWIF(privateKeyOrWif, network);
  switch (type) {
    // // multi sig 1:1 
    // case 'p2sh': {
    //   const { pubKeyAddress } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    //   const { address } = bitcoin.payments.p2sh({ address: pubKeyAddress });
    //   return address;
    // }
    // standard pay to public key hash
    case 'p2pkh': {
      const address = keyPair.getAddress()
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

function isValidAddress(address, networkId) {
  const network = bitcoin.networks[networkId];
  if (_.isUndefined(network)) throw new Error(`network not supported [${networkId}] supported networks [${Object.keys(bitcoin.networks).join(',')}]`);
  if (!_.isString(address)) throw new Error('Private key not a string');
  try {
    if (networkId == 'bitcoincash') {
      address = cashaddr.toLegacyAddress(address)
    }
    bitcoin.address.toOutputScript(address, network)
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

const SIGHASH_ALL = 0x01
const SIGHASH_BITCOINCASHBIP143 = 0x40

/**
 * Creates a 1-to-1 transaction to an address. Returns the transaction as Hex
 * 
 * @param {Array<{
 *   vout:number,
 *   txId:string,
 *   privateKey:string,
 *   sequence: number,
 *   scriptSig:string
 * }>} inputs 
 * @param {Array<{
 *   address:string,
 *   value:number
 * }>} outputs 
 * @returns {String}
 */
function create1to1Transaction(inputs, outputs, networkId) {
  const network = bitcoin.networks[networkId];
  if (_.isUndefined(network)) throw new Error(`network not supported [${networkId}] supported networks [${Object.keys(bitcoin.networks).join(',')}]`);
  const txb = new bitcoin.TransactionBuilder(network)

  // adds a 'keyPair':ECPair to each input
  inputs.forEach(input => {
    if (!_.isString(input.privateKey)) throw new Error('Private key not a string');
    input.keyPair = isHex(input.privateKey) ?
      bitcoin.ECPair.fromPrivateKeyBuffer(Buffer.from(input.privateKey, 'hex'), network) :
      bitcoin.ECPair.fromWIF(input.privateKey, network);
  });

  // add all inputs to the builder
  inputs.forEach(input => {
    txb.addInput(input.txId, input.vout)
  });

  // add all outputs to the builder
  outputs.forEach(output => {
    let address = output.address
    if (networkId == 'bitcoincash') {
      address = cashaddr.toLegacyAddress(address)
    }
    txb.addOutput(address, output.value)
  });

  // sign all inputs
  inputs.forEach((input, index) => {
    let hashType;
    if (networkId == 'bitcoincash') {
      hashType = SIGHASH_ALL | SIGHASH_BITCOINCASHBIP143
    }
    txb.sign(index, input.keyPair, undefined, hashType, input.value)
  })
  return txb.build().toHex()
}

/**
 * Select utxos and outputs.
 * 
 * @param {Array<{
 *   txId: string,
 *   vout: number,
 *   value: number
 * }>} utxos 
 * @param {Array<{
 *   address: string,
 *   value: number
 * }>} targets 
 * @param {number} feeRate 
 * @returns {{
 *   inputs:[],
 *   outputs: Array<{
 *     address: string|false|null, // if no address we must provide a change address
 *     value: number
 *   }>, 
 *   fee: number // total fee
 * }}
 */
function doCoinSelect(utxos, targets, feeRate) {
  return coinSelect(utxos, targets, feeRate)
}

function doCoinSelectSplit(utxos, targets, feeRate) {
  return coinSelectSplit(utxos, targets, feeRate)
}

module.exports = {
  getAddress,
  isValidAddress,
  bip39GenerateMnemonic,
  bip39ValidateMnemonic,
  bip44BatchDeriveKeyPairs,
  create1to1Transaction,
  doCoinSelect,
  doCoinSelectSplit,
  cashaddr
}