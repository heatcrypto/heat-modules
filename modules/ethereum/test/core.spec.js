describe("Test", function() {
  const { getAddress, isValidAddress } = window.webview.exposedMethods
  it("supports getAddress", function () {
    expect(getAddress('db0d28e794993cc890d388fdfb41034067b0a83ea128b19d7e39881d06bdd162'))
      .toBe('0x79776a5f9BD9Cb9B2fAb29074189357EE253b863');
  })
  it("supports isValidAddress", function () {
    expect(isValidAddress('0x79776a5f9BD9Cb9B2fAb29074189357EE253b863')).toBeTrue();
    expect(isValidAddress('0x79776a5f9BD9Cb9B2fAb29074189357EE25Z')).toBeFalse();
  })
})