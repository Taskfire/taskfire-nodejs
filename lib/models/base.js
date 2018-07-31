'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Base extends _events2.default {
  constructor(client) {
    super();
    if (!client) {
      throw new Error('Model must be inititated with client');
    }

    this.client = client;
    this.del = this.delete;
  }

  toString() {
    return `<${this.constructor.name} ${this.id}>`;
  }

  _updateRecord(update) {
    const original = this.toJSON();
    (0, _util.mergeUpdates)(this, update);
    this.emit('change', this, update, original);
    return this;
  }
}

exports.default = Base;