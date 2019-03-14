const { expose } = window.exposer = require('../expose')
const { 
  generateAddress,
  getAddress,
  isValidAddress,
  createPayment } = require('./src/core')

expose('generateAddress',generateAddress)
expose('getAddress',getAddress)
expose('isValidAddress',isValidAddress)
expose('createPayment',createPayment)