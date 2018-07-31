import { withCallback } from '../util'
import Queue from '../models/queue'
import Task from '../models/task'
import BaseResource from './base'

class QueueResource extends BaseResource {
  constructor (client) {
    super(client)

    this.model = Queue
    this.workers = new Map()

    // Alias
    this.process = this.worker
  }

  async create (body, cb) {
    return this._request({
      method: 'POST',
      url: '/queues',
      body,
    }, cb)
  }

  async update (queueId, body, cb) {
    return this._request({
      method: 'PUT',
      url: `/queues/${queueId}`,
      body,
    }, cb)
  }

  async delete (queueId, query, cb) {
    const resp = await this._request({
      method: 'DELETE',
      url: `/queues/${queueId}`,
      query,
    }, cb)
    // TODO: de-register any listeners!?
    this.workers.delete(queueId)
    return resp
  }

  async get (queueId, cb) {
    return this._request({
      method: 'GET',
      url: `/queues/${queueId}`,
    }, cb)
  }

  async list (queueId, query, cb) {
    return this._request({
      method: 'GET',
      url: '/queues',
      query,
    }, cb)
  }

  async push (queueId, body, cb) {
    return this.client.tasks.create({
      ...body,
      queue: queueId,
    }, cb)
  }

  async worker (queueId, handler, cb) {
    return withCallback(async () => {
      if (this.workers.has(queueId)) {
        throw new Error('Queue is already a worker')
      }

      const queue = await this._request({
        method: 'SUBSCRIBE',
        url: `/queues/${queueId}/worker`,
      }, null)

      const workerHandler = async task => handler(task)
      this.workers.set(queueId, workerHandler)

      return queue
    }, cb)
  }

  async removeWorker (queueId, cb) {
    return withCallback(async () => {
      const resp = await this._request({
        method: 'UNSUBSCRIBE',
        url: `/queues/${queueId}/worker`,
      })
      this.workers.delete(queueId)
      return resp
    }, cb)
  }

  // TODO: add close() => should close remove all subscriptions

  async _processWork (rawTask) {
    const queueId = rawTask.queue
    const task = new Task(this.client, rawTask)
    if (!this.workers.has(queueId)) {
      throw new Error('Queue is not a worker queue')
    }
    const workerHandler = this.workers.get(queueId)
    return workerHandler(task)
      .then(data => task.complete(data))
      .catch(err => task.error(err))
  }
}

export default QueueResource
