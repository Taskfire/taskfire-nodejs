import BaseResource from './base'

class ProjectResource extends BaseResource {
  constructor (client) {
    super(client)

    // Alias
    this.process = this.worker
  }

  async update (runId, body, cb) {
    return this._request({
      method: 'PUT',
      url: '/project',
      body,
    }, cb)
  }

  async get (runId, cb) {
    return this._request({
      method: 'GET',
      url: '/project',
    }, cb)
  }
}

export default ProjectResource
