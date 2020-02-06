const { FimkSDK,Builder,attachment,Transaction,RsAddress } = require("fimk-sdk")
const _ = require("lodash")

function isValidId(value) {
  return _.isString(value) && !isNaN(Number(value)) && Number(value) != 0
}

function isValidAddress(value) {
  if (value.startsWith('FIM-')) {
    return isValidId(toNumericAddress(value))
  }
  return isValidId(value)
}

function publicKeyToAddress(publicKey) {
  const sdk = new FimkSDK()  
  return sdk.crypto.getAccountIdFromPublicKey(publicKey);
}

function getAddress(privateKey) {
  const sdk = new FimkSDK()  
  return sdk.crypto.getAccountId(privateKey);
}

function toRSAddress(numericAddress) {
  const addr = new RsAddress('FIM')
  addr.set(numericAddress)
  return addr.toString()
}

function toNumericAddress(rsAddress) {
  const addr = new RsAddress('FIM')
  addr.set(rsAddress)
  return addr.account_id()
}

/**
 * Create a transaction to transfer HEAT.
 * 
 * @param {String} key 
 * @param {String | null} recipientAddress 
 * @param {String | null} recipientPublicKey 
 * @param {String} amount 
 * @param {String | null} fee 
 * @param {number} timestamp 
 * @param {String | null} message 
 * @param {Boolean | null} messageIsPrivate 
 * @param {Boolean | null} messageIsBinary 
 * 
 * @returns bytes HEX string
 */
function transferFimk(key, recipientAddress, recipientPublicKey, amount, fee, timestamp, message, messageIsPrivate, messageIsBinary) {
  if (!_.isString(key)) throw new Error(`Key arg should be "String"`)
  if (!isValidAddress(recipientAddress)) throw new Error(`recipientAddress arg not valid`)
  if (recipientPublicKey && !_.isString(recipientPublicKey)) throw new Error(`recipientPublicKey arg should be "String"`)
  if (!_.isString(amount) && !isNaN(Number(amount)) && Number(amount) > 0) throw new Error(`amount arg should be "String"`)
  if (!_.isString(fee) && !isNaN(Number(fee)) && Number(fee) > 0) throw new Error(`fee arg should be "String"`)
  if (!_.isNumber(timestamp)) throw new Error(`timestamp arg should be "Number"`)
  if (message && !_.isString(message)) throw new Error(`message arg should be "String"`)
  if (!_.isBoolean(messageIsPrivate)) throw new Error(`messageIsPrivate arg should be "Boolean"`)
  if (!_.isBoolean(messageIsBinary)) throw new Error(`messageIsBinary arg should be "Boolean"`)

  const sdk = new FimkSDK()
  const recipientAddressOrPublicKey = (_.isString(recipientPublicKey) ? recipientPublicKey : recipientAddress)
  let builder = new Builder()
    .timestamp(timestamp)
    .attachment(attachment.ORDINARY_PAYMENT)
    .amountHQT(amount)
    .feeHQT(fee)
    .ecBlockHeight(1)
    .ecBlockId("0")
  let txn = new Transaction(sdk, recipientAddressOrPublicKey, builder)
  if (message) {
    txn = messageIsPrivate ? txn.privateMessage(message, messageIsBinary) : txn.publicMessage(message, messageIsBinary)
  }
  return txn.sign(key).then(t => {
    let transaction = t.getTransaction()
    let bytes = transaction.getBytesAsHex()
    return bytes
  }) 
}

/**
 * Create a transaction to transfer HEAT.
 * 
 * @param {String} key 
 * @param {String | null} recipientAddress 
 * @param {String | null} recipientPublicKey 
 * @param {String} amount 
 * @param {String | null} fee 
 * @param {number} timestamp 
 * @param {String | null} message 
 * @param {Boolean | null} messageIsPrivate 
 * @param {Boolean | null} messageIsBinary 
 * 
 * @returns bytes HEX string
 */
function transferAsset(key, recipientAddress, recipientPublicKey, amount, fee, timestamp, asset, message, messageIsPrivate, messageIsBinary) {
  if (!_.isString(key)) throw new Error(`Key arg should be "String"`)
  if (!isValidAddress(recipientAddress)) throw new Error(`recipientAddress arg not valid`)
  if (recipientPublicKey && !_.isString(recipientPublicKey)) throw new Error(`recipientPublicKey arg should be "String"`)
  if (!_.isString(amount) && !isNaN(Number(amount)) && Number(amount) > 0) throw new Error(`amount arg should be "String"`)
  if (!_.isString(fee) && !isNaN(Number(fee)) && Number(fee) > 0) throw new Error(`fee arg should be "String"`)
  if (!_.isNumber(timestamp)) throw new Error(`timestamp arg should be "Number"`)
  if (!isValidId(asset)) throw new Error(`asset arg not valid`)
  if (message && !_.isString(message)) throw new Error(`message arg should be "String"`)
  if (!_.isBoolean(messageIsPrivate)) throw new Error(`messageIsPrivate arg should be "Boolean"`)
  if (!_.isBoolean(messageIsBinary)) throw new Error(`messageIsBinary arg should be "Boolean"`)

  const sdk = new FimkSDK()
  const recipientAddressOrPublicKey = (_.isString(recipientPublicKey) ? recipientPublicKey : recipientAddress)
  let builder = new Builder()
    .timestamp(timestamp)
    .attachment(new attachment.AssetTransfer().init(asset, amount))
    .amountHQT("0")
    .feeHQT(fee)
    .ecBlockHeight(1)
    .ecBlockId("0")
  let txn = new Transaction(sdk, recipientAddressOrPublicKey, builder)
  if (message) {
    txn = messageIsPrivate ? txn.privateMessage(message, messageIsBinary) : txn.publicMessage(message, messageIsBinary)
  }
  return txn.sign(key).then(t => {
    let transaction = t.getTransaction()
    let bytes = transaction.getBytesAsHex()
    return bytes
  }) 
}

module.exports = {
  isValidAddress,
  getAddress,
  transferFimk,
  transferAsset,
  toRSAddress,
  toNumericAddress,
  publicKeyToAddress
}