'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // import { asCallback } from 'promise-callbacks'


var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _util = require('./util');

var _projects = require('./resources/projects');

var _projects2 = _interopRequireDefault(_projects);

var _runs = require('./resources/runs');

var _runs2 = _interopRequireDefault(_runs);

var _tasks = require('./resources/tasks');

var _tasks2 = _interopRequireDefault(_tasks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaults = {
  url: 'https://api.taskfire.io'
};

class Client {
  constructor(apiToken, options) {
    if (!apiToken) {
      throw new Error('Missing required first paramater `apiToken`');
    }

    this.token = apiToken;
    this.options = _extends({}, defaults, options);

    this.project = new _projects2.default(this);
    this.runs = new _runs2.default(this);
    this.tasks = new _tasks2.default(this);
  }

  async request(req, cb) {
    return (0, _util.withCallback)(async () => {
      return (0, _requestPromiseNative2.default)(this.options.url, _extends({}, req, {
        auth: {
          user: this.token,
          pass: ''
        }
      }));
    }, cb);
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