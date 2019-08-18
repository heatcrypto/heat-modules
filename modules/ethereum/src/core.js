const Web3 = require('web3')
const web3 = new Web3();

function getAddress(privateKey, type) {
  var data = web3.eth.accounts.privateKeyToAccount(privateKey);
  return data ? data.address : null;
}

function isValidAddress(address) {
  return web3.utils.isAddress(address);
}

module.exports = {
  getAddress,
  isValidAddress
}