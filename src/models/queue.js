import Base from './base'

class Queue extends Base {
  constructor (client, record = {}) {
    super(client)

    const { id, name, createdAt } = record

    // Record fields
    this.id = id
    this.name = name
    this.createdAt = createdAt

    // Alias
    this.process = this.worker
  }

  async delete (query, cb) {
    return this.client.queues.delete(this.id, query, cb)
  }

  async worker (fn, cb) {
    return this.client.queues.worker(this.id, fn, cb)
  }

  async removeWorker (cb) {
    return this.client.queues.removeWorker(this.id, cb).then((resp) => {
      this.emit('close', resp)
      return resp
    })
  }

  toJSON () {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
    }
  }
}

export default Queue
