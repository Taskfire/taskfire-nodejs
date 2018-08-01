import BaseResource from './base'

class RunResource extends BaseResource {
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
