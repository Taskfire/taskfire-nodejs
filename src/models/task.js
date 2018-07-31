import { withCallback } from '../util'
import Base from './base'

class Task extends Base {
  constructor (client, record = {}) {
    super(client)

    const {
      id, name, queue, data, options, status,
    } = record

    this.id = id
    this.queue = queue
    this.name = name
    this.data = data
    this.status = status
    this.options = options

    this.del = this.delete
  }

  async progress (progress, cb) {
    return this.client.tasks.progress(this.id, progress, cb)
  }

  async delete (query, cb) {
    return this.client.tasks.delete(this.id, query, cb)
  }

  async update (body, cb) {
    return withCallback(async () => {
      await this.client.tasks.update(this.id, body, cb)
      this._updateRecord(body)
      return this
    }, cb)
  }

  async error (error, cb) {
    return this.client.tasks.error(this.id, this.queue, error, cb)
  }

  async complete (data, cb) {
    return this.client.tasks.complete(this.id, this.queue, data, cb)
  }

  toJSON () {
    return {
      id: this.id,
      name: this.name,
    }
  }
}

export default Task
