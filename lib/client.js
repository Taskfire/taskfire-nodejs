'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import Project from './project'


var _promiseCallbacks = require('promise-callbacks');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _util = require('./util');

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _queues = require('./resources/queues');

var _queues2 = _interopRequireDefault(_queues);

var _tasks = require('./resources/tasks');

var _tasks2 = _interopRequireDefault(_tasks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaults = {
  url: 'wss://api.queue.ws'
};

class Client extends _events2.default {
  constructor(apiToken, options) {
    super();

    if (!apiToken) {
      throw new Error('Missing required first paramater `apiToken`');
    }

    this.token = apiToken;
    this.options = _extends({}, defaults, options);

    this.ws = new _ws2.default(`${this.options.url}/${apiToken}`);
    this.ws.on('error', (...err) => this.emit('error', ...err));

    // this.project = new Project(this)
    this.queues = new _queues2.default(this);
    this.tasks = new _tasks2.default(this);

    this.requestCounter = 0;
    this.requests = new Map();

    this._sendPromise = _promiseCallbacks.promisify.method(this.ws, 'send');

    this.ready = new Promise(resolve => {
      this.ws.on('open', resolve);
      this.ws.on('message', msg => this._receive(msg));
      return true;
    }).then(() => {
      this.emit('open');
    });
  }

  async request(req, cb) {
    // Wait for connection to be ready
    await this.ready;

    this.requestCounter += 1;
    const reqData = _extends({}, req, {
      requestId: this.requestCounter
    });

    // Add the request, so we can respond later
    const request = new _request2.default(reqData);
    this.requests.set(this.requestCounter, request);

    this._send(reqData);

    if (cb) (0, _promiseCallbacks.asCallback)(request.promise, cb);
    return request.promise;
  }

  async close(cb) {
    return (0, _util.withCallback)(() => {
      this.ws.close(1000);
      return new Promise(resolve => {
        this.ws.once('close', resolve);
      });
    }, cb);
  }

  async _send(obj) {
    let json;
    try {
      json = JSON.stringify(obj);
    } catch (e) {
      throw new Error(`Client: Cannot convert request to JSON due to: ${e.message}`);
    }
    this._log('Send', obj);
    return this._sendPromise(json);
  }

  _receive(json) {
    const obj = JSON.parse(json);
    this._log('Receive', obj);

    const {
      status, requestId, type
    } = obj;

    if (type === 'RESPONSE') {
      // If for some reason that request does not exist - send error
      const req = this.requests.get(requestId);
      if (!req) this.emit('error', new Error('Invalid request ID received'));

      // Remove the request once received
      this.requests.delete(requestId);

      // Error status codes
      if (status >= 400 && status <= 599) {
        req.reject(obj);
      } else {
        // Otherwise, resolve the request
        req.resolve(obj);
      }
    } else if (type === 'WORK') {
      this.queues._processWork(obj);
    } else {
      this.emit('error', new Error('Unexpected message type received from server'));
    }
  }

  _log(event, ...params) {
    if (this.options.debug) {
      const stringy = params.map(param => JSON.stringify(param));
      // eslint-disable-next-line no-console
      console.log(event, ...stringy);
    }
  }
}

exports.default = Client;