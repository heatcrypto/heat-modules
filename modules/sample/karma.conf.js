process.env.CHROME_BIN = require('puppeteer').executablePath()
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine','jasmine-matchers'],
    plugins: [
      'karma-jasmine',
      'karma-jasmine-matchers',
      'karma-chrome-launcher'
    ],  
    files: [
      './bundle.js',
      './node_modules/lodash/lodash.js',
      './test/test.spec.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity
  })
}