'use strict';

var storeCache = {};
var memoryStore = {};

var Adapter = function Adapter(name) {
  if (name in storeCache) return Promise.resolve(storeCache[name]);

  if (!memoryStore[name]) {
    memoryStore[name] = {
      idMap: {},
      keyMap: {}
    };
  }

  var db = memoryStore[name];

  var api = {
    exists: function exists(id) {
      return _exists(db, id);
    },
    save: function save(obj) {
      return _save(db, obj);
    },
    load: function load(id) {
      return _load(db, id);
    },
    get: function get(key) {
      return _get(db, key);
    },
    remove: function remove(id) {
      return _remove(db, id);
    },
    all: function all() {
      return _all(db);
    }
  };

  storeCache[name] = api;

  // some adapters will need async, this doesn't but has to be consistent
  return Promise.resolve(api);
};

var _exists = function _exists(db, id) {
  return Promise.resolve(id in db.idMap);
};

var _save = function _save(db, obj) {
  var id = obj.value._id;
  var key = obj.value.nodeType;

  db.idMap[id] = obj;

  if (!Array.isArray(db.keyMap[key])) db.keyMap[key] = [];

  db.keyMap[key].push(id);

  return Promise.resolve(obj);
};

var _load = function _load(db, id) {
  return Array.isArray(id) ? Promise.all(id.map(function (id) {
    return _load(db, id);
  })) : Promise.resolve(db.idMap[id]);
};

var _get = function _get(db, key) {
  var ids = Array.isArray(db.keyMap[key]) ? db.keyMap[key] : [];

  return _load(db, ids);
};

var _remove = function _remove(db, id) {
  return _load(db, id).then(function (obj) {
    var key = obj.value.nodeType;

    delete db.idMap[id];

    db.keyMap[key] = db.keyMap[key].filter(function (currentId) {
      return currentId !== id;
    });

    return obj;
  });
};

var _all = function _all(db) {
  return _load(db, Object.keys(db.idMap));
};

module.exports = Adapter;