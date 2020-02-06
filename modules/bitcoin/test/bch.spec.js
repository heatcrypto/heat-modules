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
    it('can create a BCH transaction', async function () {
      var network = 'bitcoincash'
      var inputs = [{
        "txId":"70bd3035ff88abb53c12793a21b6382a507adcebc56a6fb010994cda560eafd5",
        "vout":0,
        "value":13000000,
        "privateKey":"a5610688ed7ce8e4a9..9f45581e7444bf26c1e51a737241",
      }]
      var outputs = [{
        "address":cashaddr.toLegacyAddress("bitcoincash:qpeg7dh5r74dy2tgc0ht8zrdmhrw6rx54qa7gp6e7j"),
        "value":200000
      },{
        "address":"1Bb6D1uUcMo9Gt4imnpAkipWijMQaWtdGF",
        "value":12786500
      }];
      var hex = create1to1Transaction(inputs, outputs, network)
      var url = `https://bch1.heatwallet.com/api/v2/sendtx/${hex}`
      // console.log(hex)
      // console.log(url)
      expect(hex).toBeString();      

      // DONT ENABLE OR WE SEND FUNDS

      // let response = await window.fetch(`https://bch1.heatwallet.com/api/v2/sendtx/${hex}`)
      // console.log(response.json())
    }) 
  })
})

