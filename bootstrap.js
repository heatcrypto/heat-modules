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
`function generateAddress() {
  throw new Error('Not implemented')
}

function getAddress(privateKey, type) {
  throw new Error('Not implemented')
}

function isValidAddress(address) {
  throw new Error('Not implemented')
}

function createPayment() {
  throw new Error('Not implemented')
}

module.exports = {
  generateAddress,
  getAddress,
  isValidAddress,
  createPayment
}`)

await writeFile(path.join(__dirname, `modules/${moduleName}/test/address.spec.js`), 
`describe("Test", function() {
  const { generateAddress, getAddress, isValidAddress } = window.webview.exposedMethods
  describe("Address", function () {
    let addr = generateAddress()
    it("should support address generation", function () {
      expect(addr.publicKey).toBeNonEmptyString()
      expect(addr.secret).toBeNonEmptyString()
      expect(addr.address).toBeNonEmptyString()
    })
    it("should support secret to address", function () {
      expect(getAddress(addr.secret).publicKey).toBe(addr.publicKey)
      expect(getAddress(addr.secret).address).toBe(addr.address)
    })
    it("should support address validation", function () {
      expect(isValidAddress('1 2 3')).toBeTrue()
    })
    it("should support secret validation", function () {
      expect(getAddress("1 2 3").address).toBe('4 5 6')
    })
  }) 
})`)

await writeFile(path.join(__dirname, `modules/${moduleName}/test/transaction.spec.js`), 
`describe("Test", function() {
  const { createPayment } = window.webview.exposedMethods
  describe("Payment", function () {
    it("can create payments", async function () {
      expect(() => createPayment()).toThrowError('Not implemented')
    })
  })
})`)

await writeFile(path.join(__dirname, `modules/${moduleName}/index.js`), 
`require('../expose').exposeAll(require('./src/core'))`)

await writeFile(path.join(__dirname, `modules/${moduleName}/karma.conf.js`), 
`function getSpecs(specList) {
  return specList ? specList.split(',') : ['./test/*.spec.js'] // whatever your default glob is
}
process.env.CHROME_BIN = require('puppeteer').executablePath()
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
      './node_modules/lodash/lodash.js'
    ].concat(getSpecs(process.env.KARMA_SPECS)),
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
    "build": "../../node_modules/.bin/browserify ./index.js > ./bundle.js && npm run babel",
    "babel": "../../node_modules/.bin/babel ./bundle.js --no-comments --out-file ./bundle.es5.js",
    "test": "../../node_modules/.bin/karma start ./karma.conf.js --single-run",
    "dist": "npm run build && npm run test && node ../html-wrap.js",
    "test-address": "npm run build && KARMA_SPECS='./test/address.spec.js' ../../node_modules/.bin/karma start ./karma.conf.js --single-run",
    "test-transaction": "npm run build && KARMA_SPECS='./test/transaction.spec.js' ../../node_modules/.bin/karma start ./karma.conf.js --single-run",
    "test-core": "npm run build && KARMA_SPECS='./test/core.spec.js' ../../node_modules/.bin/karma start ./karma.conf.js --single-run"
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



