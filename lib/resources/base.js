'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

  async _request(req, opt, cb) {
    // Make opt, cb optional
    const callback = opt && typeof opt === 'function' ? opt : cb;
    const options = opt && typeof opt !== 'function' || {};
    return (0, _util.withCallback)(async () => {
      const resp = await this.client.request(_extends({}, req, options));
      return this._postProcessResponse(resp);
    }, callback);
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