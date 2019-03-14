const RippleAPI = require('ripple-lib').RippleAPI;

function generateAddress() {
  const api = new RippleAPI()
  const {secret, address} = api.generateAddress();
  const keypair = api.deriveKeypair(secret)
  return {
    publicKey: keypair.publicKey,
    secret: secret,
    address: address
  }
}

function getAddress(secret) {
  const api = new RippleAPI()
  const keypair = api.deriveKeypair(secret)
  const address = api.deriveAddress(keypair.publicKey)
  return {
    publicKey: keypair.publicKey,
    address: address
  }
}

function isValidAddress(address) {
  const api = new RippleAPI()
  return api.isValidAddress(address)
}

async function createPayment(payment, instructions, secret) {
  const api = new RippleAPI()
  let sender = getAddress(secret)
  let prepared = await api.preparePayment(sender.address, payment, instructions)
  const { signedTransaction, id } = api.sign(prepared.txJSON, secret)
  return {
    signedTransaction, id, prepared
  }
}

module.exports = {
  generateAddress,
  getAddress,
  isValidAddress,
  createPayment
}