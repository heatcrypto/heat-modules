function getSpecs(specList) {
  return specList ? specList.split(',') : ['./test/*.spec.js'] // whatever your default glob is
}
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
      './node_modules/lodash/lodash.js'
    ].concat(getSpecs(process.env.KARMA_SPECS)),
    reporters: ['progress'],
    port: 9876,
    colors: true,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity
  })
}