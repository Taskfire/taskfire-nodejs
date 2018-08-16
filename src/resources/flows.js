// import { withCallback } from '../util'
import BaseResource from './base'

class FlowResource extends BaseResource {
  async create (body, cb) {
    return this._request({
      method: 'POST',
      url: '/flows',
      body,
    }, cb)
  }

  async delete (id, query, cb) {
    return this._request({
      method: 'DELETE',
      url: `/flows/${id}`,
      query,
    }, cb)
  }

  async update (id, body, cb) {
    return this._request({
      method: 'PUT',
      url: `/flows/${id}`,
      body,
    }, cb)
  }

  async list (query, cb) {
    return this._request({
      method: 'GET',
      url: '/flows',
      query,
    }, cb)
  }

  async get (id, query, cb) {
    return this._request({
      method: 'GET',
      url: `/flows/${id}`,
      query,
    }, cb)
  }
}

export default FlowResource
