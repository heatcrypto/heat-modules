const fs = require("fs-extra");
const path = require('path');
const writeFile = require('write');
const moduleName = process.argv[2];

(async function __bootstrap() {

let moduleDir = path.join(__dirname, `modules/${moduleName}`)
if (await fs.pathExists(moduleDir)) {
  console.log(`Error: path already exists '${moduleDir}'`)
  return
}

console.log(`Generating crypto module with name '${moduleName}'`)

await fs.mkdirs(path.join(__dirname, `modules/${moduleName}/src`))
await fs.mkdirs(path.join(__dirname, `modules/${moduleName}/test`))

await writeFile(path.join(__dirname, `modules/${moduleName}/src/core.js`), 
`// ========================================================================================
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
}`)

await writeFile(path.join(__dirname, `modules/${moduleName}/test/test.spec.js`), 
`describe("Test", function() {
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
    inspectPaymentTransaction
  } = window.exposer.exposedMethods

  it("should support 'isValidAddress'", async function () {
    expect(() => isValidAddress()).toThrowError('Not implemented');
  })  
  it("should support 'isValidPrivateKey'", async function () {
    expect(() => isValidPrivateKey()).toThrowError('Not implemented');
  })  
  it("should support 'isValidHDSeed'", async function () {
    expect(() => isValidHDSeed()).toThrowError('Not implemented');
  })  
  it("should support 'deriveChildKey'", async function () {
    expect(() => deriveChildKey()).toThrowError('Not implemented');
  })  
  it("should support 'privateKeyToPublicKey'", async function () {
    expect(() => privateKeyToPublicKey()).toThrowError('Not implemented');
  })  
  it("should support 'publicKeyToAddress'", async function () {
    expect(() => publicKeyToAddress()).toThrowError('Not implemented');
  })  
  it("should support 'privateKeyToAddress'", async function () {
    expect(() => privateKeyToAddress()).toThrowError('Not implemented');
  })  
  it("should support 'generatePrivateKey'", async function () {
    expect(() => generatePrivateKey()).toThrowError('Not implemented');
  })  
  it("should support 'generateHDSeed'", async function () {
    expect(() => generateHDSeed()).toThrowError('Not implemented');
  })  
  it("should support 'generatePaymentTransaction'", async function () {
    expect(() => generatePaymentTransaction()).toThrowError('Not implemented');
  })  
  it("should support 'inspectPaymentTransaction'", async function () {
    expect(() => inspectPaymentTransaction()).toThrowError('Not implemented');
  })    
})`)

await writeFile(path.join(__dirname, `modules/${moduleName}/index.js`), 
`const { expose } = window.exposer = require('../expose')
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
expose('inspectPaymentTransaction',inspectPaymentTransaction)`)

await writeFile(path.join(__dirname, `modules/${moduleName}/karma.conf.js`), 
`process.env.CHROME_BIN = require('puppeteer').executablePath()
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine','jasmine-matchers'],
    plugins: [
      'karma-jasmine',
      'karma-jasmine-matchers',
      'karma-chrome-launcher'
    ],  
    files: [
      './bundle.js',
      './node_modules/lodash/lodash.js',
      './test/test.spec.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity
  })
}`)

await writeFile(path.join(__dirname, `modules/${moduleName}/package.json`), 
`{
  "name": "${moduleName}",
  "version": "1.0.0",
  "description": "${moduleName} blockchain protocol operations",
  "main": "index.js",
  "scripts": {
    "build": "../../node_modules/.bin/browserify ./index.js > ./bundle.js && karma start ./karma.conf.js --single-run"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "lodash": "^4.17.11"
  }
}`)

console.log(`Successfully created crypto module '${moduleName}'`)
console.log(` `)
console.log(`To get started run the following commands:`)
console.log(` `)
console.log(`\tcd modules/${moduleName}`)
console.log(`\tnpm install`)
console.log(`\tnpm run build`)
console.log(` `)
console.log(`Or as a single command: cd modules/${moduleName} && npm install && npm run build`)
console.log(` `)
console.log(`And now try and get that test to pass!`)
  
})()



