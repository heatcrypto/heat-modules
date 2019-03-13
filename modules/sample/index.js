const { expose } = window.exposer = require('../expose')
const { 
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
  inspectPaymentTransaction } = require('./src/core')

expose('isValidAddress',isValidAddress)
expose('isValidPrivateKey',isValidPrivateKey)
expose('isValidHDSeed',isValidHDSeed)
expose('deriveChildKey',deriveChildKey)
expose('privateKeyToPublicKey',privateKeyToPublicKey)
expose('publicKeyToAddress',publicKeyToAddress)
expose('privateKeyToAddress',privateKeyToAddress)
expose('generatePrivateKey',generatePrivateKey)
expose('generateHDSeed',generateHDSeed)
expose('generatePaymentTransaction',generatePaymentTransaction)
expose('inspectPaymentTransaction',inspectPaymentTransaction)