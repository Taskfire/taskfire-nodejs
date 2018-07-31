'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const clients = new Map();

exports.default = (apiKey, options) => {
  if (clients.has(apiKey)) return clients.get(apiKey);
  return new _client2.default(apiKey, options);
};