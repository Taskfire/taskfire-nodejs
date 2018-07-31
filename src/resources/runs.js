import BaseResource from './base'

class RunResource extends BaseResource {
  constructor (client) {
    super(client)

    // Alias
    this.process = this.worker
  }

  async create (body, cb) {
    return this._request({
      method: 'POST',
      url: '/runs',
      body,
    }, cb)
  }

  async update (runId, body, cb) {
    return this._request({
      method: 'PUT',
      url: `/runs/${runId}`,
      body,
    }, cb)
  }

  async delete (runId, query, cb) {
    const resp = await this._request({
      method: 'DELETE',
      url: `/runs/${runId}`,
      query,
    }, cb)
    return resp
  }

  async get (runId, cb) {
    return this._request({
      method: 'GET',
      url: `/runs/${runId}`,
    }, cb)
  }

  async list (query, cb) {
    return this._request({
      method: 'GET',
      url: '/runs',
      query,
    }, cb)
  }
}

export default RunResource
