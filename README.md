# HEAT-MODULES

This repo is a collection of individual blockchain protocol implementations.

Contributions are made by creating or expanding on existing blockchain protocol implementations.

The structure of this repo is devided into modules (see the modules folder) where each module in itself is a node package that 
comes with its own package.json and its own dependencies in its own node_modules completely isolated from all other modules.

Each module is transpiled and run through browserify ending in a single stand alone bundle of javascript code that should run in
any standard browser.

Each module also comes with its own tests which make use of Jasmin (BDD tests) and Karma (tests run in a chrome browser) in order to 
mimic the target environment as best as possible.

Karma and Jasmin dependencies reside in the project root so these do not have to be installed in each module individualy.

## Installation & Usage

Please make sure you have nodejs version 8 or higher and npm installed.

We advice to install karma-cli glbally. `npm install -g karma-cli` some information that could be helpfull can be found here 
http://karma-runner.github.io/3.0/intro/installation.html

To install all dependencies for all modules run `npm install`.

To build all modules and run all tests run `npm run build`.

To run the tests for a single module we CD into that directory `cd modules/module-name` than we run those tests `npm t`.

To build a single module again CD into that directory `cd modules/module-name` than we run build `npm run build`.

## Modules

Roughly speaking we would have one module per cryptocurrency platform (that gives us modules named bitcoin, ethereum, ripple, iota, heat, eos etc..).

While not mandated generally speaking each module provides the following high level cryptocurrency operations (in no particular order).

1. Determine if an address is a structurally valid address
2. Determine if a private key is structurally valid
3. Determine if a seed is an HD seed (as defined by that platform standard)
4. Derive private keys from an HD seed
5. Derive a public key from a private key
6. Derive an address from a public key or private key
7. Generate hd seeds or private keys

Following behind these high level operations (shared amongst most modules) modules also expose fine grained more specific to their 
cryptocurrency platform operations which are generally divided up into sub-protocols.

Examples of sub protocols are for instance.

1. Ethereum: native ETH or GAS, erc20, erc223, erc721, erc621, erc827
2. Bitcoin: legacy, lightning, segwit
3. Stellar: native, 4 char asset, 12 char asset
4. HEAT: native  HEAT, assets, asset exchange 

For each of these sub protocols we would expose the actions that can be performed (actions generally speaking are invoked by creating 
binary transactions which can be broadcasted to the network). 
Generally speaking this means that each sub protocol has a `transfer amount X to address Y` transaction. 
Where needed other actions can be exposed.

Apart from generating these binary transactions it is highly desired that the modules can parse and confirm the binary transactions in order 
to verify what we are broadcasting before we do so.