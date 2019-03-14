# Add support for your blockchain

Adding support for your blockchain can't get any easier.

## Installation

Follow these steps to get started, in most cases just a few lines of Javascript are needed from you to add support for your blockchain.

Before we start make sure the following dependencies are pre-installed.

- git
- nodejs (version 8 or higher)
- npm (comes with nodejs)
- [karma](http://karma-runner.github.io/3.0/intro/installation.html) (run `npm install -g karma-cli` to install)

On the command line run.

```shell
# clone the repo
git clone https://github.com/Heat-Ledger-Ltd/heat-modules.git

# cd into the repo
cd heat-modules

# install dependencies
npm install

# bootstrap your own empty module (using ripple as an example here)
npm run bootstrap ripple

# et voila, here is your new module
ls modules/ripple
  -> index.js  karma.conf.js  package.json  src  test
```

## Implementation (full Ripple example)

In order to support any blockchain we need to know how to deal with addresses and transactions.

We are going to follow the sample of adding native support for Ripple, similar steps apply for any other blockchain.

    Use `npm run bootstrap-utxo` for utxo based blockchains

### Address support

As with most cryptocurrencies Ripple has an official sdk, lets install that first so we can use that.

```bash
# make sure we are in ./modules/ripple when running this command
npm install ripple-lib --save
```

Now open the file [`./modules/ripple/src/core.js`](https://github.com/Heat-Ledger-Ltd/heat-modules/blob/master/modules/ripple/src/core.js) that was generated for you in the bootstrap step and add the following code
so we support Ripple addresses.

```js
const RippleAPI = require('ripple-lib').RippleAPI;

function generateAddress() {
  const api = new RippleAPI()
  const {secret, address} = api.generateAddress();
  const keypair = api.deriveKeypair(secret)
  return {
    publicKey: keypair.publicKey,
    secret: secret,
    address: address,
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

[... rest of code ...]
```

Thats it! You have just completed implementing address support for Ripple.

Now for the unit tests.. Open the file [`./modules/ripple/test/address.spec.js`](https://github.com/Heat-Ledger-Ltd/heat-modules/blob/master/modules/ripple/test/address.spec.js) that was generated for you during the bootstrap step.

[`address.spec.js`](https://github.com/Heat-Ledger-Ltd/heat-modules/blob/master/modules/ripple/test/address.spec.js) is a [Jasmine](https://jasmine.github.io/) BDD test (visit the Jasmine page to learn more).

The first two `tests` require no input from you and should pass. The third and fourth test we need to provide 
with some actual valid and invalid addresses and secrets, we did so for you below.

```js
[... rest of code ...]

    it("should support address validation", function () {
      expect(isValidAddress('rLTH4Adi38RCRzWQiCAMGbH22VgQNJeX7C')).toBeTrue()
      expect(isValidAddress('rUQikgSbpKfT2Yr9KRcevJtFEdpfHcZBZv')).toBeTrue()
      expect(isValidAddress('zLTH4Adi38RCRzWQiCAMGbH22VgQNJeX7C')).toBeFalse()
      expect(isValidAddress('rLTH4Adi38RCRzWQiMGbH22VgQNJeX7C')).toBeFalse()
    })
    it("should support secret validation", function () {
      expect(getAddress("snu3s7NiW7FsN5Gq4FTSc2EX6D9zB").address).toBe('rsywaBeNiq88RGFsBPioVQhphb7XDEDJdR')
      expect(getAddress("saf6SZAiUpkCdESFfb44TCqTGtQ7z").address).toBe('r4virxg35Ri71xWJjNpBh2q85c9uV6b7MP')
      expect(() => getAddress("snu3s7NiW7FsN5Gq4FTSc2EX6D9z")).toThrowError("checksum_invalid")
      expect(() => getAddress("snu3s7NiW7FsN5Gq4FTSc2EX6D9zB91")).toThrowError("checksum_invalid")
    })

[... rest of code ...]    
```

Run the test to see if all is working, address support for Ripple is complete.

```shell
npm run test-address
```

### Transaction support

Now we add support for sending payments on the Ripple blockchain.

Again open [`./modules/ripple/src/core.js`](https://github.com/Heat-Ledger-Ltd/heat-modules/blob/master/modules/ripple/src/core.js) and add the following code to add support for creating payments on the Ripple blockchain.

```js
async function createPayment(payment, instructions, secret) {
  const api = new RippleAPI()
  let sender = getAddress(secret)
  let prepared = await api.preparePayment(sender.address, payment, instructions)
  const { signedTransaction, id } = api.sign(prepared.txJSON, secret)
  return {
    signedTransaction, id, prepared
  }
}
```

Note that when it comes to transactions our implementation is not as generic as that for addresses. This fact is important and by design.

Our aim here is to support not just sending payments, instead we aim to support the full depth of functionality for each separate blockchain in
order to be able to use most of its features where needed.

Now lets test our payment functionality.

Open the file [`./modules/ripple/test/transaction.spec.js`](https://github.com/Heat-Ledger-Ltd/heat-modules/blob/master/modules/ripple/test/transaction.spec.js) that was generated for you during the bootstrap step. And add the following code.

```js
describe("Test", function() {
  const { createPayment } = window.exposer.exposedMethods
  describe("Payment", function () {
    it("can create payments", async function () {
      let address = 'rsywaBeNiq88RGFsBPioVQhphb7XDEDJdR'
      let secret = 'snu3s7NiW7FsN5Gq4FTSc2EX6D9zB'
      let payment = {
        source: {
          address: address,
          maxAmount: {
            value: '0.01',
            currency: 'XRP'
          }
        },
        destination: {
          address: 'r4virxg35Ri71xWJjNpBh2q85c9uV6b7MP',
          amount: {
            value: '0.01',
            currency: 'XRP'
          }
        }      
      }
      let instructions = {
        maxLedgerVersion: 8820051,
        fee: '0.000012',
        sequence: 1,
        signersCount: 1
      }
      let data = await createPayment(payment, instructions, secret)
      let txJSON = JSON.parse(data.prepared.txJSON)     
      expect(txJSON.TransactionType).toBe('Payment')
      expect(txJSON.Account).toBe('rsywaBeNiq88RGFsBPioVQhphb7XDEDJdR')
      expect(txJSON.Destination).toBe('r4virxg35Ri71xWJjNpBh2q85c9uV6b7MP')
      expect(txJSON.Amount).toBe('10000')
    })
  })
})
```

Now run our test with `npm run test-transaction` to see if we succeeded in adding Ripple support.
