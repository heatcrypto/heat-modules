const { HeatSDK } = require("heat-sdk")
const _ = require("lodash")
const sdk = new HeatSDK()

// Determine if an address is a structurally valid address
function isValidAddress(value) {
  return _.isString(value) && !isNaN(Number(value)) && Number(value) != 0
}

// throws an error to see if that works
function throwAnError(value) {
  if (value)
    throw new Error("hello")
  return value
}

// Determine if a private key is structurally valid
function isValidPrivateKey(value) {
  return _.isString(value) && value.trim().length > 0
}

// Determine if a seed is an HD seed (as defined by that platform standard)
function isHDSeed(value) {
  return false
}

// Derive private keys from an HD seed
function getNthPrivateKeyFromSeed(seed, index) {
  return null
}

// Derive a public key from a private key
function privateKeyToPublicKey(value) {
  return sdk.crypto.secretPhraseToPublicKey(value)
}

// Derive an address from a public key or private key
function publicKeyToAddress(value) {
  return sdk.crypto.getAccountIdFromPublicKey(value)
}

// Generate a private key (single address)
function generatePrivateKey() {
  return sdk.secretGenerator.generate()
}

module.exports = {
  isValidAddress,
  isValidPrivateKey,
  isHDSeed,
  getNthPrivateKeyFromSeed,
  privateKeyToPublicKey,
  publicKeyToAddress,
  generatePrivateKey,
  throwAnError
}