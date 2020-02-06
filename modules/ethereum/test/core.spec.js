describe("Test", function() {
  const { 
    getAddress, 
    isValidAddress, 
    transferEth,
    transferErc20 } = window.webview.exposedMethods
  it("supports getAddress", function () {
    expect(getAddress('db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162'))
      .toBe('0x79776a5f9BD9Cb9B2fAb29074189357EE253b863');
  })
  it("supports isValidAddress", function () {
    expect(isValidAddress('0x79776a5f9BD9Cb9B2fAb29074189357EE253b863')).toBeTrue();
    expect(isValidAddress('0x79776a5f9BD9Cb9B2fAb29074189357EE25Z')).toBeFalse();
  })
  it("supports transferEth", async function () {
    var privateKey = "0xcecee6703bd6274014e0beabb7a00951c849253b1a5d9f60418422ebb8344fba",
      to = "0x2652a649aBa066D8C1e37B0A0C45dFD5E1c91527",
      nonce = "10",
      value = "10000",
      gasPrice = "20000000000",
      gasLimit = "21000",
      chainId = "1";

    var bytes = await transferEth(privateKey, to, value, nonce, gasPrice, gasLimit, chainId);
    console.log(bytes)
    expect(bytes).toBeString()
  })  
  it("supports transferErc20", async function () {
    var privateKey = "0xcecee6703bd6274014e0beabb7a00951c849253b1a5d9f60418422ebb8344fba",
      to = "0x2652a649aBa066D8C1e37B0A0C45dFD5E1c91527",
      nonce = "10",
      value = "10000",
      gasPrice = "20000000000",
      gasLimit = "21000",
      chainId = "1",
      contractAddress = "0xd26114cd6ee289accf82350c8d8487fedb8a0c07";

    var bytes = await transferErc20(privateKey, contractAddress, to, value, nonce, gasPrice, gasLimit, chainId);
    console.log(bytes)
    expect(bytes).toBeString()

    // let response = await window.fetch(`https://eth1.heatwallet.com/api/v2/sendtx/${bytes}`)
    // console.log(response.json())

  })   
})
