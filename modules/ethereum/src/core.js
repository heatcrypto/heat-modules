const ethers = require("ethers");
const Web3 = require('web3')
const web3 = new Web3();
const erc20TransferAbi = [{
  "constant": false,
  "inputs": [{
    "name": "_to",
    "type": "address"
  },{
    "name": "_value",
    "type": "uint256"
  }],
  "name": "transfer",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "type": "function"
}];

function getAddress(privateKey, type) {
  var data = web3.eth.accounts.privateKeyToAccount(privateKey);
  return data ? data.address : null;
}

function isValidAddress(address) {
  return web3.utils.isAddress(address);
}

function transferEth(privateKey, to, value, nonce, gasPrice, gasLimit, chainId) {
  var tx = {
    to,
    nonce,
    value,
    gasPrice,
    gasLimit,
    chainId
  }
  return web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
    return signed.rawTransaction;
  });
}

function transferErc20(privateKey, contractAddress, to, value, nonce, gasPrice, gasLimit, chainId) {
  const from = getAddress(privateKey)
  const contract = new web3.eth.Contract(erc20TransferAbi, contractAddress, { from });
  const data = contract.methods.transfer(to, value).encodeABI()
  const tx = {
    from,
    to: contractAddress,
    nonce,
    value: '0x0',
    gasPrice,
    gasLimit,
    chainId,
    data,
  }
  return web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
    return signed.rawTransaction;
  });
}

/**
 * These are here in order to support walletconnect
 * 
 * - https://docs.walletconnect.org/json-rpc/ethereum#personal_sign
 * - https://docs.walletconnect.org/json-rpc/ethereum#eth_sign
 * - https://docs.walletconnect.org/json-rpc/ethereum#eth_signtypeddata
 * - https://docs.walletconnect.org/json-rpc/ethereum#eth_sendtransaction
 * - https://docs.walletconnect.org/json-rpc/ethereum#eth_signtransaction
 * - https://docs.walletconnect.org/json-rpc/ethereum#eth_sendrawtransaction
 */

// @see https://github.com/WalletConnect/walletconnect-test-wallet/blob/459590ea59d6f4aabe13a7a9bc223cff49f5dd01/src/helpers/wallet.ts
//      And ethers repo

function getEthersWallet(privateKey) {
  var signingKey = new ethers.utils.SigningKey(test.privateKey);
}

function personal_sign() {

}
function eth_sign(privateKey) {}
function eth_signTypedData() {}
function eth_sendTransaction() {}
function eth_signTransaction() {}
function eth_parseRawTransaction() {}

module.exports = {
  getAddress,
  isValidAddress,
  transferEth,
  transferErc20
}