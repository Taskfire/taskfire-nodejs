'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RunResource extends _base2.default {
  async get(runId, cb) {
    return this._request({
      method: 'GET',
      url: `/runs/${runId}`
    }, cb);
  }

  async list(query, cb) {
    return this._request({
      method: 'GET',
      url: '/runs',
      query
    }, cb);
  }
}

exports.default = RunResource;