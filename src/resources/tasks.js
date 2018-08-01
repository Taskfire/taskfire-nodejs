// import { withCallback } from '../util'
import BaseResource from './base'

class TaskResource extends BaseResource {
  async create (body, cb) {
    return this._request({
      method: 'POST',
      url: '/tasks',
      body,
    }, cb)
  }

  async delete (id, query, cb) {
    return this._request({
      method: 'DELETE',
      url: `/tasks/${id}`,
      query,
    }, cb)
  }

  async update (id, body, cb) {
    return this._request({
      method: 'PUT',
      url: `/tasks/${id}`,
      body,
    }, cb)
  }

  async list (query, cb) {
    return this._request({
      method: 'GET',
      url: '/tasks',
      query,
    }, cb)
  }

  async get (id, query, cb) {
    return this._request({
      method: 'GET',
      url: `/tasks/${id}`,
      query,
    }, cb)
  }
}

export default TaskResource
