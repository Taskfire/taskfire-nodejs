import { asCallback } from 'promise-callbacks'

class BaseResource {
  constructor (client) {
    if (!client) {
      throw new Error('Client is required for Resource')
    }
    this.client = client

    // Default delete alias
    if (this.delete) this.del = this.delete
  }

  async _request (req, cb) {
    const wrapper = this._postProcessResponse(this.client.request(req))
    if (cb) asCallback(wrapper, cb)
    return wrapper
  }

  async _postProcessResponse (promise) {
    const { body } = await promise
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
