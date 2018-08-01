'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util');

class BaseResource {
  constructor(client) {
    if (!client) {
      throw new Error('Client is required for Resource');
    }
    this.client = client;

    // Default delete alias
    if (this.delete) this.del = this.delete;
  }

  async _request(req, cb) {
    return (0, _util.withCallback)(async () => {
      const resp = await this.client.request(req);
      return this._postProcessResponse(resp);
    }, cb);
  }

  async _postProcessResponse(body) {
    if (Array.isArray(body)) return body.map(obj => this._postProcessItem(obj));
    return this._postProcessItem(body);
  }

  _postProcessItem(item) {
    if (!this.model) return item;
    const Model = this.model;
    return new Model(this.client, item);
  }
}

exports.default = BaseResource;