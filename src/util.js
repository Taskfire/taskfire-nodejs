import { asCallback } from 'promise-callbacks'
import merge from 'merge'

export async function withCallback (fn, cb) {
  // Convert fn to async
  const promiseGen = async () => fn()
  const promise = promiseGen()
  if (cb) asCallback(promise, cb)
  return promise
}

export function mergeUpdates (obj, updates) {
  Object.keys(updates).forEach((key) => {
    const originalVal = obj[key]
    // Don't update unknwon props (we set all known props to null)
    if (originalVal === undefined) return

    // Test for plain object
    if (typeof originalVal === 'object' && originalVal.constructor === Object) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = merge.recursive(originalVal, updates[key])
      return
    }
    // eslint-disable-next-line no-param-reassign
    obj[key] = updates[key]
  })
  return obj
}
