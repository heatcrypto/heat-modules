// ========================================================================================
// Instructions: 
//
//  Please "npm install --save my-lib" and then include as "const myLib = require('my-lib')" 
//  any external libraries you require for this module.
//  Now implement the methods below for your target currency.
//  Some methods require only a method body, others require you to define the parameters for
//  that method as well depending on the target currency.
//
//  Comments about what the code is doing are always welcome!
//  Please try and include links to documentation on the features you are showcasing.
//
// ========================================================================================

// Determine if an address is a structurally valid address
function isValidAddress(address) {
  throw new Error('Not implemented')
}

// Determine if a private key is structurally valid
function isValidPrivateKey(privateKey) {
  throw new Error('Not implemented')
}

// Determine if a seed is an HD seed (as defined by that platform standard)
function isValidHDSeed(hdSeed) {
  throw new Error('Not implemented')
}

// Derive private keys from an HD seed
function deriveChildKey(hdSeed, index) {
  throw new Error('Not implemented')
}

// Derive a public key from a private key
function privateKeyToPublicKey(privateKey) {
  throw new Error('Not implemented')
}

// Derive an address from a public key
function publicKeyToAddress(publicKey) {
  throw new Error('Not implemented')
}

// Derive an address from a private key
function privateKeyToAddress(privateKey) {
  throw new Error('Not implemented')
}

// Generate a private key
function generatePrivateKey() {
  throw new Error('Not implemented')
}

// Generate HD seed
function generateHDSeed() {
  throw new Error('Not implemented')
}

// Generate and sign a payment transaction, please try and return the transaction in a form
// which is compatible with the standard currency API broadcast or send method
function generatePaymentTransaction(privateKey, recipient, amount) {
  throw new Error('Not implemented')
}

// Inspect a binary payment transaction, should return an object of available properties
// example: { recipient: "", amount: "", fee: "" }
function inspectPaymentTransaction(transaction) {
  throw new Error('Not implemented')
}

module.exports = {
  isValidAddress,
  isValidPrivateKey,
  isValidHDSeed,
  deriveChildKey,
  privateKeyToPublicKey,
  publicKeyToAddress,
  privateKeyToAddress,
  generatePrivateKey,
  generateHDSeed,
  generatePaymentTransaction,
  inspectPaymentTransaction
}