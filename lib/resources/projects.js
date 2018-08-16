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

  async update(runId, body, options, cb) {
    return this._request({
      method: 'PUT',
      url: '/project',
      body
    }, options, cb);
  }

  // get(runId)
  // get(runId, cb)
  // get(runId, options, cb)
  async get(runId, options, cb) {
    return this._request({
      method: 'GET',
      url: '/project'
    }, options, cb);
  }
}

exports.default = ProjectResource;