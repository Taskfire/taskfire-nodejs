'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FlowResource extends _base2.default {
  async create(body, cb) {
    return this._request({
      method: 'POST',
      url: '/flows',
      body
    }, cb);
  }

  async delete(id, query, cb) {
    return this._request({
      method: 'DELETE',
      url: `/flows/${id}`,
      query
    }, cb);
  }

  async update(id, body, cb) {
    return this._request({
      method: 'PUT',
      url: `/flows/${id}`,
      body
    }, cb);
  }

  async list(query, cb) {
    return this._request({
      method: 'GET',
      url: '/flows',
      query
    }, cb);
  }

  async get(id, query, cb) {
    return this._request({
      method: 'GET',
      url: `/flows/${id}`,
      query
    }, cb);
  }
} // import { withCallback } from '../util'
exports.default = FlowResource;