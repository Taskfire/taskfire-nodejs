'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Queue extends _base2.default {
  constructor(client, record = {}) {
    super(client);

    const { id, name, createdAt } = record;

    // Record fields
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;

    // Alias
    this.process = this.worker;
  }

  async delete(query, cb) {
    return this.client.queues.delete(this.id, query, cb);
  }

  async worker(fn, cb) {
    return this.client.queues.worker(this.id, fn, cb);
  }

  async removeWorker(cb) {
    return this.client.queues.removeWorker(this.id, cb).then(resp => {
      this.emit('close', resp);
      return resp;
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt
    };
  }
}

exports.default = Queue;