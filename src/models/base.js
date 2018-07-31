import EventEmitter from 'events'
import { mergeUpdates } from '../util'

class Base extends EventEmitter {
  constructor (client) {
    super()
    if (!client) {
      throw new Error('Model must be inititated with client')
    }

    this.client = client
    this.del = this.delete
  }

  toString () {
    return `<${this.constructor.name} ${this.id}>`
  }

  _updateRecord (update) {
    const original = this.toJSON()
    mergeUpdates(this, update)
    this.emit('change', this, update, original)
    return this
  }
}

export default Base
