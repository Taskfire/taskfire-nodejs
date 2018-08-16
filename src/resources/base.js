import { withCallback } from '../util'

class BaseResource {
  constructor (client) {
    if (!client) {
      throw new Error('Client is required for Resource')
    }
    this.client = client

    // Default delete alias
    if (this.delete) this.del = this.delete
  }

  async _request (req, opt, cb) {
    // Make opt, cb optional
    const callback = opt && typeof opt === 'function' ? opt : cb
    const options = (opt && typeof opt !== 'function') || {}
    return withCallback(async () => {
      const resp = await this.client.request({
        req,
        ...options,
      })
      return this._postProcessResponse(resp)
    }, callback)
  }

  async _postProcessResponse (body) {
    if (Array.isArray(body)) return body.map(obj => this._postProcessItem(obj))
    return this._postProcessItem(body)
  }

  _postProcessItem (item) {
    if (!this.model) return item
    const Model = this.model
    return new Model(this.client, item)
  }
}

export default BaseResource
