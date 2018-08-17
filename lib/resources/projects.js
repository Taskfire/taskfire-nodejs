'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProjectResource extends _base2.default {
  async create(body, cb) {
    return this._request({
      method: 'POST',
      url: '/projects',
      body
    }, cb);
  }

  async delete(id, query, cb) {
    return this._request({
      method: 'DELETE',
      url: `/projects/${id}`,
      query
    }, cb);
  }

  async update(id, body, cb) {
    return this._request({
      method: 'PUT',
      url: `/projects/${id}`,
      body
    }, cb);
  }

  async list(query, cb) {
    return this._request({
      method: 'GET',
      url: '/projects',
      query
    }, cb);
  }

  async get(id, query, cb) {
    return this._request({
      method: 'GET',
      url: `/projects/${id}`,
      query
    }, cb);
  }
}

exports.default = ProjectResource;