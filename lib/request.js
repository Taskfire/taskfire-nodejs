"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class Request {
  constructor(id, request) {
    this.id = id;
    this.request = request;
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  resolve(data) {
    this._resolve(_extends({}, data, {
      request: this.request
    }));
  }

  reject(data) {
    this._reject(_extends({}, data, {
      request: this.request
    }));
  }
}

exports.default = Request;