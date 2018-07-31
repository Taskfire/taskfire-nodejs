'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util');

var _task = require('../models/task');

var _task2 = _interopRequireDefault(_task);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TaskResource extends _base2.default {
  constructor(client) {
    super(client);

    this.model = _task2.default;
  }

  async create(body, cb) {
    return (0, _util.withCallback)(async () => {
      if (!body.queue) throw new Error('Missing required `queue` property');
      return this._request({
        method: 'POST',
        url: '/tasks',
        body
      }, cb);
    }, cb);
  }

  async delete(id, query, cb) {
    return (0, _util.withCallback)(async () => {
      await this._request({
        method: 'DELETE',
        url: `/tasks/${id}`,
        query
      });
      return this;
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

  async error(id, queueId, body, cb) {
    return this._request({
      method: 'PUT',
      url: `/queues/${queueId}/worker/${id}/error`,
      body
    }, cb);
  }

  async complete(id, queueId, err, cb) {
    return this._request({
      method: 'PUT',
      url: `/queues/${queueId}/worker/${id}/complete`,
      body: err
    }, cb);
  }

  async progress(id, progress, cb) {
    return this._request({
      method: 'PUT',
      path: `/tasks/${id}`,
      body: {
        progress
      }
    }, cb);
  }
}

exports.default = TaskResource;