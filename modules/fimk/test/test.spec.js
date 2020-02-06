describe("Test", function() {
  const { getAddress,
    isValidAddress,
    transferFimk,
    transferAsset,
    toRSAddress,
    toNumericAddress } = window.webview.exposedMethods
  it("should support 'toRSAddress'", function () {
    expect(toRSAddress('11201384877209115915')).toBe('FIM-QRAD-8D59-288R-BJUWQ')
    expect(toRSAddress('FIM-QRAD-8D59-288R-BJUWQ')).toBe('FIM-QRAD-8D59-288R-BJUWQ')
  })    
  it("should support 'toNumericAddress'", function () {
    expect(toNumericAddress('FIM-QRAD-8D59-288R-BJUWQ')).toBe('11201384877209115915')
    expect(toNumericAddress('11201384877209115915')).toBe('11201384877209115915')
  })   
  it("should support 'isValidAddress'", function () {
    expect(isValidAddress('11201384877209115915')).toBeTrue()
    expect(isValidAddress('000')).toBeFalse()
    expect(isValidAddress('abc')).toBeFalse()
  })
  it("should support 'getAddress'", function () {
    expect(getAddress('2420e62e204d37554b3a1463ee6d2fe87133053877f51591e0b9c98ab9fd993e')).toBe('11201384877209115915')
    expect(getAddress('15c33fe460045abee529918c862322bc83ebbc297152395882b52fa723eef163')).toBe('11740260613755006687')
  })  
  it("should support 'transferFimk'", async function () {
    let key = 'privatekey', 
      recipientAddress = '1234', 
      recipientPublicKey = null, 
      amount = '10000000', 
      fee = '1000000',
      timestamp = 10000000000, 
      message = null, 
      messageIsPrivate = true, 
      messageIsBinary = false;
    let bytes = await transferFimk(key, recipientAddress, recipientPublicKey, amount, fee, timestamp, message, messageIsPrivate, messageIsBinary)
    expect(bytes).toBeString();
    console.log(bytes)
  })    
  it("should support 'transferAsset'", async function () {
    let key = 'privatekey', 
      recipientAddress = '1234', 
      recipientPublicKey = null, 
      amount = '10000000', 
      fee = '1000000', 
      timestamp = 10000000000, 
      asset = '111111111',
      message = null, 
      messageIsPrivate = true, 
      messageIsBinary = false;
    let bytes = await transferAsset(key, recipientAddress, recipientPublicKey, amount, fee, timestamp, asset, message, messageIsPrivate, messageIsBinary)
    expect(bytes).toBeString();
    console.log(bytes)
  })  

  // it("should support 'isValidPrivateKey'", async function () {
  //   expect(await invoke('isValidPrivateKey','abc')).toBe(true)
  //   expect(await invoke('isValidPrivateKey','1')).toBe(true)
  //   expect(await invoke('isValidPrivateKey','  ')).toBe(false)
  // })
  // it("should support 'isHDSeed'", async function () {
  //   expect(await invoke('isHDSeed','a b c')).toBe(false)
  // })
  // it("should support 'getNthPrivateKeyFromSeed'", async function () {
  //   expect(await invoke('getNthPrivateKeyFromSeed','a',1)).toBe(null)
  // })      
  // it("should support 'privateKeyToPublicKey'", async function () {
  //   expect(await invoke('privateKeyToPublicKey','abcdef')).toBe('2420e62e204d37554b3a1463ee6d2fe87133053877f51591e0b9c98ab9fd993e')
  // })
  // it("should support 'publicKeyToAddress'", async function () {
  //   expect(await invoke('publicKeyToAddress','15c33fe460045abee529918c862322bc83ebbc297152395882b52fa723eef163')).toBe('6215295865268904313')
  // })  
  // it("should support 'generatePrivateKey'", async function () {
  //   let privateKey = await invoke('generatePrivateKey')
  //   expect(_.isString(privateKey)).toBe(true)
  // })  
  // describe("transfer heat", function () {
  //   async function test(test) {
  //     const { key, recipientAddress, recipientPublicKey, amount, fee, networkType, message, messageIsPrivate, messageIsBinary } = test
  //     let bytes = await invoke('createTransferHeat', key, recipientAddress, recipientPublicKey, amount, fee, networkType, message, messageIsPrivate, messageIsBinary)
  //     let data = await invoke('inspectTransferHeat', key, recipientPublicKey, networkType, bytes)
  //     it("should match", function () {
  //       if (recipientAddress) {
  //         expect(data.recipientAddress).toBe(recipientAddress)
  //       }
  //       if (recipientPublicKey) {
  //         expect(data.recipientPublicKey).toBe(recipientPublicKey)
  //       }
  //       expect(data.amount).toBe(amount)
  //       if (fee) {
  //         expect(data.fee).toBe(fee)
  //       }
  //       if (message) {
  //         expect(data.message).toBe(message)
  //         expect(data.messageIsPrivate).toBe(messageIsPrivate)
  //         expect(data.messageIsBinary).toBe(messageIsBinary)
  //       }
  //     })
  //   }
  //   // no message with fee
  //   test({
  //     key: "abc", 
  //     recipientAddress: "123", 
  //     recipientPublicKey: null, 
  //     amount: "100000000", 
  //     fee: "10000000"
  //   })
  //   // no message without fee    
  //   test({
  //     key: "abcd", 
  //     recipientAddress: "123", 
  //     recipientPublicKey: null, 
  //     amount: "100000000", 
  //   })    
  //   // public message text
  //   test({
  //     key: "abcde", 
  //     recipientAddress: "123", 
  //     recipientPublicKey: null, 
  //     amount: "100000000", 
  //     message: "hello", 
  //     messageIsPrivate: false, 
  //     messageIsBinary: false
  //   })    
  //   // public message binary
  //   test({
  //     key: "abcdef", 
  //     recipientAddress: "123", 
  //     recipientPublicKey: null, 
  //     amount: "100000000", 
  //     message: "hello", 
  //     messageIsPrivate: false, 
  //     messageIsBinary: true
  //   })    
  //   // private message text
  //   test({
  //     key: "abcdefg", 
  //     recipientPublicKey: "15c33fe460045abee529918c862322bc83ebbc297152395882b52fa723eef163", 
  //     amount: "100000000", 
  //     message: "hello", 
  //     messageIsPrivate: true, 
  //     messageIsBinary: false
  //   })    
  //   // private message binary
  //   test({
  //     key: "abcdefgh", 
  //     recipientPublicKey: "15c33fe460045abee529918c862322bc83ebbc297152395882b52fa723eef163", 
  //     amount: "100000000", 
  //     message: "hello", 
  //     messageIsPrivate: true, 
  //     messageIsBinary: true
  //   })     
  // })
})