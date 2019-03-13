const { HeatSDK, attachment, Builder, Transaction, Configuration} = require("heat-sdk")
const _ = require("lodash")

/**
 * Create a transaction to transfer HEAT.
 * 
 * @param {String} key 
 * @param {String | null} recipientAddress 
 * @param {String | null} recipientPublicKey 
 * @param {String} amount 
 * @param {String | null} fee 
 * @param {'prod' | 'test' | null} networkType 
 * @param {String | null} message 
 * @param {Boolean | null} messageIsPrivate 
 * @param {Boolean | null} messageIsBinary 
 * 
 * @returns bytes HEX string
 */
function create(key, recipientAddress, recipientPublicKey, amount, fee, networkType, message, messageIsPrivate, messageIsBinary) {
  const isTestnet = networkType == 'test' ? true : false
  const sdk = new HeatSDK(new Configuration({isTestnet:isTestnet}))
  const recipientAddressOrPublicKey = (_.isString(recipientPublicKey) ? recipientPublicKey : recipientAddress)
  let builder = new Builder()
    .isTestnet(sdk.config.isTestnet)
    .genesisKey(sdk.config.genesisKey)
    .attachment(attachment.ORDINARY_PAYMENT)
    .amountHQT(amount)
  if (_.isString(fee))
    builder.feeHQT(fee)
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
 * Parse the transfer heat transaction and return all details
 * 
 * @param {String} key 
 * @param {String | null} recipientPublicKey
 * @param {'prod' | 'test' | null} networkType 
 * @param {String HEX} bytes 
 */
function inspect(key, recipientPublicKey, networkType, bytes) {
  const isTestnet = networkType == 'test' ? true : false
  const sdk = new HeatSDK(new Configuration({isTestnet:isTestnet}))

  let txn = sdk.parseTransactionBytes(bytes)
  let t1 = txn.type.getType()
  if (t1!=0) 
    throw new Error(`Invalid type expected '0' but got '${t1}'`)

  let t2 = txn.type.getSubtype()
  if (t2!=0) 
    throw new Error(`Invalid type expected '0' but got '${t2}'`)

  let publishPublicKey = getRecipientPublicKeyFromTransaction(txn)
  if (publishPublicKey) {
    if (recipientPublicKey && publishPublicKey != recipientPublicKey) {
      throw new Error(`Published public key ${publishPublicKey} does not match provided ${recipientPublicKey}`)
    }
    recipientPublicKey = publishPublicKey
  }

  let message = getMessageFromTransaction(key, recipientPublicKey, txn) || 
    { message: null, messageIsPrivate: false, messageIsBinary: false };
  return {
    recipientAddress:txn.recipientId, 
    recipientPublicKey:recipientPublicKey, 
    amount:txn.amountHQT, 
    fee:txn.feeHQT,
    message: message.message, 
    messageIsPrivate: message.messageIsPrivate,
    messageIsBinary: message.messageIsBinary
  }
}

function getMessageFromTransaction(key, recipientPublicKey, txn) {
  if (txn.message) {
    return {
      message: (txn.message.isText ? 
        sdk.converters.byteArrayToString(txn.message.message) : 
        sdk.converters.byteArrayToHexString(txn.message.message)),
      messageIsBinary: txn.message.isText,
      messageIsPrivate: false
    }
  }
  // Should use txn.encryptedMessage but is txn.encryptToSelfMessage which is a bug in heat-sdk
  let encryptedMessage = txn.appendages.find(appendage => !_.isUndefined(appendage.encryptedMessage) && appendage.version==1)
  if (encryptedMessage && recipientPublicKey) {
    let message = sdk.crypto.decryptMessage(
      encryptedMessage.encryptedMessage.data, 
      encryptedMessage.encryptedMessage.nonce, 
      recipientPublicKey, key)
    return {
      message: message,
      messageIsBinary: !(encryptedMessage.encryptedMessage.isText),
      messageIsPrivate: true
    }
  }
}

function getRecipientPublicKeyFromTransaction(txn) {
  let appendix = txn.appendages.find(appendage => !_.isUndefined(appendage.publicKey) && appendage.version==1)
  if (appendix)
    return sdk.converters.byteArrayToHexString(appendix.publicKey)
  return null
}

module.exports = {
  create:create,
  inspect:inspect
}