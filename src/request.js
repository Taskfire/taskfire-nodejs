class Request {
  constructor (id, request) {
    this.id = id
    this.request = request
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  resolve (data) {
    this._resolve({
      ...data,
      request: this.request,
    })
  }

  reject (data) {
    this._reject({
      ...data,
      request: this.request,
    })
  }
}

export default Request
