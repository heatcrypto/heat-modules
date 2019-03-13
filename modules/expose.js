const _ = require("lodash")
const exposedMethods = {}

function invoke(method, argv) {
  if (_.isFunction(exposedMethods[method])) 
    return exposedMethods[method].apply(this, argv)
  console.log(`No exposed method with id '${method}'`)
  throw new Error(`No exposed method with id '${method}'`)
}

module.exports = {
  expose: function (methodId, func) {
    if (!_.isUndefined(exposedMethods[methodId])) 
      throw new Error(`Duplicate method '${methodId}'`)
    if (!_.isFunction(func))
      throw new Error('Exposed function is not a function')
    exposedMethods[methodId] = func
  },
  invoke: function () {
    let _arguments = Array.prototype.slice.call(arguments);
    return invoke(_arguments.shift(), _arguments)
  },
  exposedMethods: exposedMethods
}