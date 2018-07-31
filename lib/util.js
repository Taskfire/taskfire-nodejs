'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withCallback = withCallback;
exports.mergeUpdates = mergeUpdates;

var _promiseCallbacks = require('promise-callbacks');

var _merge = require('merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function withCallback(fn, cb) {
  // Convert fn to async
  const promiseGen = async () => fn();
  const promise = promiseGen();
  if (cb) (0, _promiseCallbacks.asCallback)(promise, cb);
  return promise;
}

function mergeUpdates(obj, updates) {
  Object.keys(updates).forEach(key => {
    const originalVal = obj[key];
    // Don't update unknwon props (we set all known props to null)
    if (originalVal === undefined) return;

    // Test for plain object
    if (typeof originalVal === 'object' && originalVal.constructor === Object) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = _merge2.default.recursive(originalVal, updates[key]);
      return;
    }
    // eslint-disable-next-line no-param-reassign
    obj[key] = updates[key];
  });
  return obj;
}