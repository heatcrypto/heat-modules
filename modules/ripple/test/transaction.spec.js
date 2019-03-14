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
