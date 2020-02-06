describe("Test", function () {
  const { getAddress,
    isValidAddress,
    bip39GenerateMnemonic,
    bip39ValidateMnemonic,
    bip44BatchDeriveKeyPairs,
    create1to1Transaction,
    doCoinSelect,
    cashaddr } = window.webview.exposedMethods
  describe("Core", function () {
    it("can validate an address [BASE58 P2SH]", function () {
      var address = "31sr1MqY9PiTfJkEXfY5BphdPcyfWQVB1m"
      var valid = isValidAddress(address, 'bitcoin');
      expect(valid).toBeTrue();
      console.log(`${address} is valid => ${valid}`)
    });

    it("can generate a mnemonic", function () {
      var mnemonic = bip39GenerateMnemonic();
      expect(mnemonic).toBeString()
    })
    it("can validate mnemonic", function () {
      var validMnemonic = bip39GenerateMnemonic();
      var inValidMnemonic = "a b c";
      expect(bip39ValidateMnemonic(validMnemonic)).toBeTrue();
      expect(bip39ValidateMnemonic(inValidMnemonic)).toBeFalse();
    })
    it('can batch derive keys', function () {
      var mnemonic = 'curve culture obvious priority comic climb rain urge hat adult version left';
      var paths = ["m/44'/20'/0'/0/0", "m/44'/20'/0'/0/1", "m/44'/20'/0'/0/2", "m/44'/20'/0'/0/3", "m/44'/20'/0'/0/4", "m/44'/20'/0'/0/5"];
      var result = bip44BatchDeriveKeyPairs(mnemonic, paths);
      expect(result).toEqual([
        ['db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162', '03aa68b89751d0dd7137b7fcc4142a264983ccfbe8abee96889357cd1d3a08aeb1'], 
        ['9c89833b38af4cb094bdc567b982a5a08de6cee1061dbee03c42b691ec1e7255', '031dedc69ee354ec4685c7650c642c408e7695a74a56a4eb5e2aa767177fdac319'], 
        ['d9ca2dc6197b68cf843e12d585120092bd80292910d13b6859341552380b5f41', '0217209b1ccd8d7c29dca07d7c22dabb0944015e7790bef31fec77c184dba110ff'], 
        ['9a90202c985c29ce71cdaa99583d5b5a4960ad74392c086873db59bed466eb8f', '03a4ec8a67ec08233cfb99174574facd8a97de20c2872dc6a0aafc371b1461529a'], 
        ['d3995e4d498a74ecda2617029d4958ead9070e48708ee3c524fbe023136f64cf', '0227e14e7822fc6e4bc6d6e3987762287add07c241650df85de24dd0e73ee79491'], 
        ['c0bcefff63df91949f299f8c5b8638c4c33bfe17e6edeab867f1a1f9039fc5f0', '02221d55b7b85c439a6cf9f8f06e5923fdfc3b26118a0617bec4866d9a6a68f48a']
      ]);
    })
    it('can batch derive BCH key', function () {
      var mnemonic = 'curve culture obvious priority comic climb rain urge hat adult version left';
      var paths = ["m/44'/145'/0'/0/0"];
      var result = bip44BatchDeriveKeyPairs(mnemonic, paths);
      console.log('BCH key test', result)
      expect(result).toEqual([
        [ '71ffdc0e35267c1e57e260040baabf3968d5d57ea5c79da6745742dac8961086', '021a38f86f05ca56fa972b88919c803305d344803d9e00b7310bca62ca49091998' ],
      ]);
    })
    // it('can generate "p2pk" addresses', function () {
    //   var address = getAddress('db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162','p2pk');
    //   expect(address).toBe('hi');
    // });
    // it('can generate "p2sh" addresses', function () {
    //   var address = getAddress('db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162','p2sh');
    //   expect(address).toBe('hi');
    // })
    it('can generate "p2pkh" addresses', function () {
      var address = getAddress('db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162', 'p2pkh', 'bitcoin');
      expect(address).toBe('1129ZupA1o364Brx7AG9GVz9utqsgGph9V');
      expect(isValidAddress(address, 'bitcoin')).toBeTrue()
      expect(isValidAddress(address, 'testnet')).toBeFalse()
      expect(isValidAddress(address, 'litecoin')).toBeFalse()

      var address = getAddress('db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162', 'p2pkh', 'testnet');
      expect(address).toBe('mfY6rxu8ppULqJLZpjEX6RCUmtSaZzcnoq');
      expect(isValidAddress(address, 'bitcoin')).toBeFalse()
      expect(isValidAddress(address, 'testnet')).toBeTrue()
      expect(isValidAddress(address, 'litecoin')).toBeFalse()

      var address = getAddress('db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162', 'p2pkh', 'litecoin');
      expect(address).toBe('LKF6q87z6TH9JzZ7HJFSYX3v87D9kmwbPx');
      expect(isValidAddress(address, 'bitcoin')).toBeFalse()
      expect(isValidAddress(address, 'testnet')).toBeFalse()
      expect(isValidAddress(address, 'litecoin')).toBeTrue()
    })
    // it('can generate "bech32" addresses', function () {
    //   var address = getAddress('db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162','bech32');
    //   expect(address).toBe('bc1qqqmez5ldzjhmdwp58y3yq8da4qsczw658wmrrw');
    // })
    it('can create a 1-to-1 Transaction', function () {
      var network = 'bitcoin'
      var inputs = [{
        vout: 0,
        txId: '61d520ccb74288c96bc1a2b20ea1c0d5a704776dd0164a396efec3ea7040349d',
        value: 12000,
        privateKey: '43f5126d2a36a788280a1b1e6ad69bf52317075a7d50f5a38490b0178516bde1',
      }]
      var outputs = [{
        address: '1cMh228HTCiwS8ZsaakH8A8wze1JR5ZsP',
        value: 6000
      }]
      var hex = create1to1Transaction(inputs, outputs, network)
      expect(hex).toBeString();
      //console.log('hex',{hex})
    })
    it('can do coinselect algo', function () {
      var utxos = [{
        vout: 0,
        txId: '61d520ccb74288c96bc1a2b20ea1c0d5a704776dd0164a396efec3ea7040349d',
        value: 1200000,
      }]
      var targets = [{
        address: '1cMh228HTCiwS8ZsaakH8A8wze1JR5ZsP',
        value: 4000
      }]
      var feeRate = 55;
      var resp = doCoinSelect(utxos, targets, feeRate)
      expect(resp).toBeTruthy(resp);
      //console.log('coinselect', JSON.stringify(resp,null,2))
    })
    it('can create a transaction', function () {
      var network = 'testnet'
      var inputs = [{
        "txId": "31cccbee3887d65ce434d30c999e08ec59854701c4632754708edbe8c90817f2",
        "vout": 0,
        "value": 1000000,
        "privateKey": "43f5126d2a36a788280a1b1e6ad69bf52317075a7d50f5a38490b0178516bde1"
      }]
      var outputs = [{
        "address": "mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt",
        "value": 200000
      }, {
        "address": "moABEE6dNAdUVQRQQqs2PSu1wi99HkC9RR",
        "value": 786500
      }];
      var hex = create1to1Transaction(inputs, outputs, network)
      console.log(hex)
      expect(hex).toBeString();

      // I/flutter (19204): doCoinSelect([{"txId":"31cccbee3887d65ce434d30c999e08ec59854701c4632754708edbe8c90817f2","vout":0,"value":1000000},{"txId":"76db0868f8f4270161193b9f44f5ac4d2dd06d4a39edef14be5ac7a656f24354","vout":1,"value":1000000}],[{"address":"mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt","value":200000}],60) -> "{\"result\":{\"inputs\":[{\"txId\":\"31cccbee3887d65ce434d30c999e08ec59854701c4632754708edbe8c90817f2\",\"vout\":0,\"value\":1000000}],\"outputs\":[{\"address\":\"mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt\",\"value\":200000},{\"value\":786500}],\"fee\":13500}}"
      // I/chromium(19204): [INFO:CONSOLE(8)] "Error: mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt has no matching Script", source:  (8)
      // I/flutter (19204): create1to1Transaction(],"testnet") -> "{\"error\":{},\"message\":\"mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt has no matching Script\"}"      
    })
    it('can create a BCH transaction', function () {
      var network = 'bitcoincash'
      let address1 = cashaddr.toLegacyAddress("bitcoincash:qp6z806vsuh3n5hd5q7ffxzcvutxck23eq7qt8xe89")
      let address2 = cashaddr.toLegacyAddress("bitcoincash:qpeg7dh5r74dy2tgc0ht8zrdmhrw6rx54qa7gp6e7j")
      //let address1 = "bitcoincash:qp6z806vsuh3n5hd5q7ffxzcvutxck23eq7qt8xe89"
      //let address2 = "bitcoincash:qpeg7dh5r74dy2tgc0ht8zrdmhrw6rx54qa7gp6e7j"
      var inputs = [{
        "txId":"70bd3035ff88abb53c12793a21b6382a507adcebc56a6fb010994cda560eafd5",
        "vout":0,
        "value":1000000,
        "privateKey":"71ffdc0e35267c1e57e260040baabf3968d5d57ea5c79da6745742dac8961086",
        "scriptSig": "48304502210085604db6cf99873745ff23a47f044c4427d7621889f13882b9a3e7d26e37968e02204c7bb3d17f4746e674271047ff2110d33ea01d0aefd1c2eb265aafe748059004412103acaa4cfe20ea91df61a38e79df8888013db6b031c806e409cb386178e29ef8cd",
        "sequence": 4294967294
      }]
      var outputs = [{
        "address":address1,
        "value":200000
      },{
        "address":address2,
        "value":786500
      }];
      var hex = create1to1Transaction(inputs, outputs, network)
      console.log(hex)
      expect(hex).toBeString();      

      // I/flutter (19204): doCoinSelect([{"txId":"31cccbee3887d65ce434d30c999e08ec59854701c4632754708edbe8c90817f2","vout":0,"value":1000000},{"txId":"76db0868f8f4270161193b9f44f5ac4d2dd06d4a39edef14be5ac7a656f24354","vout":1,"value":1000000}],[{"address":"mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt","value":200000}],60) -> "{\"result\":{\"inputs\":[{\"txId\":\"31cccbee3887d65ce434d30c999e08ec59854701c4632754708edbe8c90817f2\",\"vout\":0,\"value\":1000000}],\"outputs\":[{\"address\":\"mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt\",\"value\":200000},{\"value\":786500}],\"fee\":13500}}"
      // I/chromium(19204): [INFO:CONSOLE(8)] "Error: mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt has no matching Script", source:  (8)
      // I/flutter (19204): create1to1Transaction(],"testnet") -> "{\"error\":{},\"message\":\"mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt has no matching Script\"}"      
    })    

  })
})