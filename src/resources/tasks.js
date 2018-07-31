import { withCallback } from '../util'
import Task from '../models/task'
import BaseResource from './base'

class TaskResource extends BaseResource {
  constructor (client) {
    super(client)

    this.model = Task
  }

  async create (body, cb) {
    return withCallback(async () => {
      if (!body.queue) throw new Error('Missing required `queue` property')
      return this._request({
        method: 'POST',
        url: '/tasks',
        body,
      }, cb)
    }, cb)
  }

  async delete (id, query, cb) {
    return withCallback(async () => {
      await this._request({
        method: 'DELETE',
        url: `/tasks/${id}`,
        query,
      })
      return this
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

  async error (id, queueId, body, cb) {
    return this._request({
      method: 'PUT',
      url: `/queues/${queueId}/worker/${id}/error`,
      body,
    }, cb)
  }

  async complete (id, queueId, err, cb) {
    return this._request({
      method: 'PUT',
      url: `/queues/${queueId}/worker/${id}/complete`,
      body: err,
    }, cb)
  }

  async progress (id, progress, cb) {
    return this._request({
      method: 'PUT',
      path: `/tasks/${id}`,
      body: {
        progress,
      },
    }, cb)
  }
}

export default TaskResource
