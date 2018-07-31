'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _util = require('../util');

var _queue = require('../models/queue');

var _queue2 = _interopRequireDefault(_queue);

var _task = require('../models/task');

var _task2 = _interopRequireDefault(_task);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class QueueResource extends _base2.default {
  constructor(client) {
    super(client);

    this.model = _queue2.default;
    this.workers = new Map();

    // Alias
    this.process = this.worker;
  }

  async create(body, cb) {
    return this._request({
      method: 'POST',
      url: '/queues',
      body
    }, cb);
  }

  async update(queueId, body, cb) {
    return this._request({
      method: 'PUT',
      url: `/queues/${queueId}`,
      body
    }, cb);
  }

  async delete(queueId, query, cb) {
    const resp = await this._request({
      method: 'DELETE',
      url: `/queues/${queueId}`,
      query
    }, cb);
    // TODO: de-register any listeners!?
    this.workers.delete(queueId);
    return resp;
  }

  async get(queueId, cb) {
    return this._request({
      method: 'GET',
      url: `/queues/${queueId}`
    }, cb);
  }

  async list(queueId, query, cb) {
    return this._request({
      method: 'GET',
      url: '/queues',
      query
    }, cb);
  }

  async push(queueId, body, cb) {
    return this.client.tasks.create(_extends({}, body, {
      queue: queueId
    }), cb);
  }

  async worker(queueId, handler, cb) {
    return (0, _util.withCallback)(async () => {
      if (this.workers.has(queueId)) {
        throw new Error('Queue is already a worker');
      }

      const queue = await this._request({
        method: 'SUBSCRIBE',
        url: `/queues/${queueId}/worker`
      }, null);

      const workerHandler = async task => handler(task);
      this.workers.set(queueId, workerHandler);

      return queue;
    }, cb);
  }

  async removeWorker(queueId, cb) {
    return (0, _util.withCallback)(async () => {
      const resp = await this._request({
        method: 'UNSUBSCRIBE',
        url: `/queues/${queueId}/worker`
      });
      this.workers.delete(queueId);
      return resp;
    }, cb);
  }

  // TODO: add close() => should close remove all subscriptions

  async _processWork(rawTask) {
    const queueId = rawTask.queue;
    const task = new _task2.default(this.client, rawTask);
    if (!this.workers.has(queueId)) {
      throw new Error('Queue is not a worker queue');
    }
    const workerHandler = this.workers.get(queueId);
    return workerHandler(task).then(data => task.complete(data)).catch(err => task.error(err));
  }
}

exports.default = QueueResource;