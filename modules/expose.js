var _ = require("lodash")
var exposedMethods = (window.webview = window.webview || {}).exposedMethods = {}

module.exports = {
  exposeAll: function(map) {
    _.forEach(map, function (value, key) {
      exposedMethods[key] = value;
    });
  },
  exposedMethods: exposedMethods
}