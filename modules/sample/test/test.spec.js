describe("Test", function() {
  const { 
    isValidAddress,
    isValidPrivateKey,
    isValidHDSeed,
    deriveChildKey,
    privateKeyToPublicKey,
    publicKeyToAddress,
    privateKeyToAddress,
    generatePrivateKey,
    generateHDSeed,
    generatePaymentTransaction,
    inspectPaymentTransaction
  } = window.exposer.exposedMethods

  it("should support 'isValidAddress'", async function () {
    expect(() => isValidAddress()).toThrowError('Not implemented');
  })  
  it("should support 'isValidPrivateKey'", async function () {
    expect(() => isValidPrivateKey()).toThrowError('Not implemented');
  })  
  it("should support 'isValidHDSeed'", async function () {
    expect(() => isValidHDSeed()).toThrowError('Not implemented');
  })  
  it("should support 'deriveChildKey'", async function () {
    expect(() => deriveChildKey()).toThrowError('Not implemented');
  })  
  it("should support 'privateKeyToPublicKey'", async function () {
    expect(() => privateKeyToPublicKey()).toThrowError('Not implemented');
  })  
  it("should support 'publicKeyToAddress'", async function () {
    expect(() => publicKeyToAddress()).toThrowError('Not implemented');
  })  
  it("should support 'privateKeyToAddress'", async function () {
    expect(() => privateKeyToAddress()).toThrowError('Not implemented');
  })  
  it("should support 'generatePrivateKey'", async function () {
    expect(() => generatePrivateKey()).toThrowError('Not implemented');
  })  
  it("should support 'generateHDSeed'", async function () {
    expect(() => generateHDSeed()).toThrowError('Not implemented');
  })  
  it("should support 'generatePaymentTransaction'", async function () {
    expect(() => generatePaymentTransaction()).toThrowError('Not implemented');
  })  
  it("should support 'inspectPaymentTransaction'", async function () {
    expect(() => inspectPaymentTransaction()).toThrowError('Not implemented');
  })    
})