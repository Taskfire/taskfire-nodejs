'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProjectResource extends _base2.default {
  constructor(client) {
    super(client);

    // Alias
    this.process = this.worker;
  }

  async update(runId, body, cb) {
    return this._request({
      method: 'PUT',
      url: '/project',
      body
    }, cb);
  }

  async get(runId, cb) {
    return this._request({
      method: 'GET',
      url: '/project'
    }, cb);
  }
}

exports.default = ProjectResource;