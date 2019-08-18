describe("Test", function () {
  const { getAddress,
    isValidAddress,
    bip39GenerateMnemonic,
    bip39ValidateMnemonic,
    bip44BatchDeriveKeyPairs } = window.webview.exposedMethods
  describe("Core", function () {
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
      expect(result).toBeArray([
        ['db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162', '03aa68b89751d0dd7137b7fcc4142a264983ccfbe8abee96889357cd1d3a08aeb1'],
        ['9c89833b38af4cb094bdc567b982a5a08de6cee1061dbee03c42b691ec1e7255', '031dedc69ee354ec4685c7650c642c408e7695a74a56a4eb5e2aa767177fdac319'],
        ['d9ca2dc6197b68cf843e12d585120092bd80292910d13b6859341552380b5f41', '0217209b1ccd8d7c29dca07d7c22dabb0944015e7790bef31fec77c184dba110ff'],
        ['9a90202c985c29ce71cdaa99583d5b5a4960ad74392c086873db59bed466eb8f', '03a4ec8a67ec08233cfb99174574facd8a97de20c2872dc6a0aafc371b1461529a'],
        ['d3995e4d498a74ecda2617029d4958ead9070e48708ee3c524fbe023136f64cf', '0227e14e7822fc6e4bc6d6e3987762287add07c241650df85de24dd0e73ee79491'],
        ['c0bcefff63df91949f299f8c5b8638c4c33bfe17e6edeab867f1a1f9039fc5f0', '02221d55b7b85c439a6cf9f8f06e5923fdfc3b26118a0617bec4866d9a6a68f48a']
      ]);
    })
    it('can get a wif key from a private key', function () {

    });
    // it('can generate "p2pk" addresses', function () {
    //   var address = getAddress('db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162','p2pk');
    //   expect(address).toBe('hi');
    // });
    // it('can generate "p2sh" addresses', function () {
    //   var address = getAddress('db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162','p2sh');
    //   expect(address).toBe('hi');
    // })
    // it('can generate "p2pkh" addresses', function () {
    //   var address = getAddress('db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162','p2pkh');
    //   expect(address).toBe('1129ZupA1o364Brx7AG9GVz9utqsgGph9V');
    // })
    // it('can generate "bech32" addresses', function () {
    //   var address = getAddress('db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162','bech32');
    //   expect(address).toBe('bc1qqqmez5ldzjhmdwp58y3yq8da4qsczw658wmrrw');
    // })
  })
})