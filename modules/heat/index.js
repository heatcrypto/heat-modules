const { expose } = window.exposer = require('../expose')
const { 
  isValidAddress,
  isValidPrivateKey,
  isHDSeed,
  getNthPrivateKeyFromSeed,
  privateKeyToPublicKey,
  publicKeyToAddress,
  generatePrivateKey,
  throwAnError
} = require('./src/core')
const transferHeat = require('./src/transfer-heat')

// core.js
expose('isValidAddress',isValidAddress)
expose('isValidPrivateKey',isValidPrivateKey)
expose('isHDSeed',isHDSeed)
expose('getNthPrivateKeyFromSeed',getNthPrivateKeyFromSeed)
expose('privateKeyToPublicKey',privateKeyToPublicKey)
expose('publicKeyToAddress',publicKeyToAddress)
expose('generatePrivateKey',generatePrivateKey)

// transfer-heat.js
expose('createTransferHeat',transferHeat.create)
expose('inspectTransferHeat',transferHeat.inspect)

// debug
expose('throwAnError', throwAnError)