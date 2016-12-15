'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var EntityNode = require('mtype-node');
var Events = require('mevents');
var utils = require('mojule-utils');

var matches = utils.matches;


var typeError = function typeError(fnName, argName, expectType) {
  return new TypeError(fnName + ' expects ' + argName + ' to be ' + expectType);
};

var defaults = {
  find: function find(api, source) {
    var allCandidates = typeof source.nodeType === 'string' ? api.get(source.nodeType) : api.all();

    return allCandidates.then(function (candidates) {
      return candidates.filter(function (node) {
        return matches(node.value, source);
      });
    });
  }
};

var BaseStore = function BaseStore(adapter) {
  var events = Events();

  var exists = function exists(id) {
    if (typeof id !== 'string') typeError('Store.exists', 'id', 'a string');

    return adapter.exists(id);
  };

  var save = function save(obj) {
    if (EntityNode.mtype.is(obj, 'entityNodeValue')) {
      obj = EntityNode(obj.nodeType, obj);
    }

    if (!EntityNode.mtype.is(obj, 'entityNode')) {
      typeError('Store.save', 'obj', 'an entityNode');
    }

    var now = new Date().toJSON();

    if (typeof obj.value._created !== 'string') obj.value._created = now;

    obj.value._updated = now;

    events.emit('save', obj);

    return adapter.save(obj);
  };

  var load = function load(id) {
    if (typeof id !== 'string' && !Array.isArray(id)) typeError('Store.load', 'id', 'a string or an array');

    return adapter.load(id);
  };

  var get = function get(nodeType) {
    if (typeof nodeType !== 'string') typeError('Store.get', 'nodeType', 'a string');

    return adapter.get(nodeType);
  };

  var remove = function remove(id) {
    if (typeof id !== 'string') typeError('Store.remove', 'id', 'a string');

    events.emit('remove', id);

    return adapter.remove(id);
  };

  var find = function find(source) {
    if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) !== 'object') typeError('Store.find', 'id', 'a string');

    if (typeof adapter.find === 'function') return adapter.find(source);

    return defaults.find(api, source);
  };

  var all = function all() {
    return adapter.all();
  };

  var on = events.on;

  var api = {
    exists: exists, save: save, load: load, get: get, remove: remove, all: all, on: on, find: find
  };

  return api;
};

module.exports = BaseStore;