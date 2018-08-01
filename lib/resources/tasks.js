'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TaskResource extends _base2.default {
  async create(body, cb) {
    return this._request({
      method: 'POST',
      url: '/tasks',
      body
    }, cb);
  }

  async delete(id, query, cb) {
    return this._request({
      method: 'DELETE',
      url: `/tasks/${id}`,
      query
    }, cb);
  }

  async update(id, body, cb) {
    return this._request({
      method: 'PUT',
      url: `/tasks/${id}`,
      body
    }, cb);
  }

  async list(query, cb) {
    return this._request({
      method: 'GET',
      url: '/tasks',
      query
    }, cb);
  }

  async get(id, query, cb) {
    return this._request({
      method: 'GET',
      url: `/tasks/${id}`,
      query
    }, cb);
  }
} // import { withCallback } from '../util'
exports.default = TaskResource;