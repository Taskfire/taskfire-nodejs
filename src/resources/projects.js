import BaseResource from './base'

class ProjectResource extends BaseResource {
  async create (body, cb) {
    return this._request({
      method: 'POST',
      url: '/projects',
      body,
    }, cb)
  }

  async delete (id, query, cb) {
    return this._request({
      method: 'DELETE',
      url: `/projects/${id}`,
      query,
    }, cb)
  }

  async update (id, body, cb) {
    return this._request({
      method: 'PUT',
      url: `/projects/${id}`,
      body,
    }, cb)
  }

  async list (query, cb) {
    return this._request({
      method: 'GET',
      url: '/projects',
      query,
    }, cb)
  }

  async get (id, query, cb) {
    return this._request({
      method: 'GET',
      url: `/projects/${id}`,
      query,
    }, cb)
  }
}

export default ProjectResource
