import BaseResource from './base'

class ProjectResource extends BaseResource {
  constructor (client) {
    super(client)

    // Alias
    this.process = this.worker
  }

  async update (runId, body, options, cb) {
    return this._request({
      method: 'PUT',
      url: '/project',
      body,
    }, options, cb)
  }

  // get(runId)
  // get(runId, cb)
  // get(runId, options, cb)
  async get (runId, options, cb) {
    return this._request({
      method: 'GET',
      url: '/project',
    }, options, cb)
  }
}

export default ProjectResource
