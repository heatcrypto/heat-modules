describe("Test", function() {
  const invoke = window.exposer.invoke
  it("should support 'isValidAddress'", async function () {
    expect(await invoke('isValidAddress','123')).toBe(true)
    expect(await invoke('isValidAddress','000')).toBe(false)
    expect(await invoke('isValidAddress','abc')).toBe(false)
  })
  it("should support 'isValidPrivateKey'", async function () {
    expect(await invoke('isValidPrivateKey','abc')).toBe(true)
    expect(await invoke('isValidPrivateKey','1')).toBe(true)
    expect(await invoke('isValidPrivateKey','  ')).toBe(false)
  })
  it("should support 'isHDSeed'", async function () {
    expect(await invoke('isHDSeed','a b c')).toBe(false)
  })
  it("should support 'getNthPrivateKeyFromSeed'", async function () {
    expect(await invoke('getNthPrivateKeyFromSeed','a',1)).toBe(null)
  })      
  it("should support 'privateKeyToPublicKey'", async function () {
    expect(await invoke('privateKeyToPublicKey','abcdef')).toBe('2420e62e204d37554b3a1463ee6d2fe87133053877f51591e0b9c98ab9fd993e')
  })
  it("should support 'publicKeyToAddress'", async function () {
    expect(await invoke('publicKeyToAddress','15c33fe460045abee529918c862322bc83ebbc297152395882b52fa723eef163')).toBe('6215295865268904313')
  })  
  it("should support 'generatePrivateKey'", async function () {
    let privateKey = await invoke('generatePrivateKey')
    expect(_.isString(privateKey)).toBe(true)
  })  
  describe("transfer heat", function () {
    async function test(test) {
      const { key, recipientAddress, recipientPublicKey, amount, fee, networkType, message, messageIsPrivate, messageIsBinary } = test
      let bytes = await invoke('createTransferHeat', key, recipientAddress, recipientPublicKey, amount, fee, networkType, message, messageIsPrivate, messageIsBinary)
      let data = await invoke('inspectTransferHeat', key, recipientPublicKey, networkType, bytes)
      it("should match", function () {
        if (recipientAddress) {
          expect(data.recipientAddress).toBe(recipientAddress)
        }
        if (recipientPublicKey) {
          expect(data.recipientPublicKey).toBe(recipientPublicKey)
        }
        expect(data.amount).toBe(amount)
        if (fee) {
          expect(data.fee).toBe(fee)
        }
        if (message) {
          expect(data.message).toBe(message)
          expect(data.messageIsPrivate).toBe(messageIsPrivate)
          expect(data.messageIsBinary).toBe(messageIsBinary)
        }
      })
    }
    // no message with fee
    test({
      key: "abc", 
      recipientAddress: "123", 
      recipientPublicKey: null, 
      amount: "100000000", 
      fee: "10000000"
    })
    // no message without fee    
    test({
      key: "abcd", 
      recipientAddress: "123", 
      recipientPublicKey: null, 
      amount: "100000000", 
    })    
    // public message text
    test({
      key: "abcde", 
      recipientAddress: "123", 
      recipientPublicKey: null, 
      amount: "100000000", 
      message: "hello", 
      messageIsPrivate: false, 
      messageIsBinary: false
    })    
    // public message binary
    test({
      key: "abcdef", 
      recipientAddress: "123", 
      recipientPublicKey: null, 
      amount: "100000000", 
      message: "hello", 
      messageIsPrivate: false, 
      messageIsBinary: true
    })    
    // private message text
    test({
      key: "abcdefg", 
      recipientPublicKey: "15c33fe460045abee529918c862322bc83ebbc297152395882b52fa723eef163", 
      amount: "100000000", 
      message: "hello", 
      messageIsPrivate: true, 
      messageIsBinary: false
    })    
    // private message binary
    test({
      key: "abcdefgh", 
      recipientPublicKey: "15c33fe460045abee529918c862322bc83ebbc297152395882b52fa723eef163", 
      amount: "100000000", 
      message: "hello", 
      messageIsPrivate: true, 
      messageIsBinary: true
    })     
  })
})