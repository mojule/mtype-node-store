'use strict';

var DefaultAdapter = require('./memoryAdapter');
var BaseStore = require('./basestore');

var Store = function Store(name, options) {
  options = Object.assign({}, defaultOptions, options);

  var _options = options,
      Adapter = _options.Adapter;


  return Adapter(name, options).then(function (adapter) {
    return BaseStore(adapter);
  });
};

var defaultOptions = {
  Adapter: DefaultAdapter
};

module.exports = Store;