const { HeatSDK } = require("heat-sdk")
const _ = require("lodash")
const sdk = new HeatSDK()

function isValidAddress(value) {
  return _.isString(value) && !isNaN(Number(value)) && Number(value) != 0
}

function getAddress(privateKey) {
  return sdk.crypto.getAccountId(privateKey);
}

module.exports = {
  isValidAddress,
  getAddress
}