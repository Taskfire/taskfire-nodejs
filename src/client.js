// import { asCallback } from 'promise-callbacks'
import request from 'request-promise-native'
import { withCallback } from './util'

import ProjectResources from './resources/projects'
import RunResources from './resources/runs'
import FlowResources from './resources/flows'

const defaults = {
  url: 'https://api.taskfire.io',
  request: {
    json: true,
  },
  requireAuth: true,
  debug: false,
}

class Client {
  constructor (apiToken, options) {
    this.options = {
      ...defaults,
      ...options,
    }

    // if (!apiToken && this.options.requireAuth) {
    //   throw new Error('Missing required first paramater `apiToken`')
    // }

    this.token = apiToken

    this.project = new ProjectResources(this)
    this.runs = new RunResources(this)
    this.flows = new FlowResources(this)
  }

  async request (req, cb) {
    return withCallback(async () => {
      const query = req.query || {}
      if (this.options.projectId) {
        query.projectId = this.options.projectId
      }
      const reqObj = {
        ...this.options.request,
        auth: this.token && {
          bearer: this.token,
        },
        baseUrl: this.options.url,
        ...req,
        qs: query,
      }
      this._log('request', reqObj)
      return request(reqObj)
    }, cb)
  }

  _log (event, ...params) {
    if (this.options.debug) {
      const stringy = params.map(param => JSON.stringify(param))
      // eslint-disable-next-line no-console
      console.log(event, ...stringy)
    }
  }
}

export default Client
