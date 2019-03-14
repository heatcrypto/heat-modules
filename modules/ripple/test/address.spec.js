describe("Test", function() {
  const { generateAddress, getAddress, isValidAddress } = window.exposer.exposedMethods
  describe("Address", function () {
    let addr = generateAddress()
    it("should support address generation", function () {
      expect(addr.publicKey).toBeNonEmptyString()
      expect(addr.secret).toBeNonEmptyString()
      expect(addr.address).toBeNonEmptyString()
    })
    it("should support secret to address", function () {
      expect(getAddress(addr.secret).publicKey).toBe(addr.publicKey)
      expect(getAddress(addr.secret).address).toBe(addr.address)
    })
    it("should support address validation", function () {
      expect(isValidAddress('rLTH4Adi38RCRzWQiCAMGbH22VgQNJeX7C')).toBeTrue()
      expect(isValidAddress('rUQikgSbpKfT2Yr9KRcevJtFEdpfHcZBZv')).toBeTrue()
      expect(isValidAddress('zLTH4Adi38RCRzWQiCAMGbH22VgQNJeX7C')).toBeFalse()
      expect(isValidAddress('rLTH4Adi38RCRzWQiMGbH22VgQNJeX7C')).toBeFalse()
    })
    it("should support secret validation", function () {
      expect(getAddress("snu3s7NiW7FsN5Gq4FTSc2EX6D9zB").address).toBe('rsywaBeNiq88RGFsBPioVQhphb7XDEDJdR')
      expect(getAddress("saf6SZAiUpkCdESFfb44TCqTGtQ7z").address).toBe('r4virxg35Ri71xWJjNpBh2q85c9uV6b7MP')
      expect(() => getAddress("snu3s7NiW7FsN5Gq4FTSc2EX6D9z")).toThrowError("checksum_invalid")
      expect(() => getAddress("snu3s7NiW7FsN5Gq4FTSc2EX6D9zB91")).toThrowError("checksum_invalid")
    })
  }) 
})