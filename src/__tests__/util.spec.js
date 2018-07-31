import { withCallback, mergeUpdates } from '../util'

describe('util', () => {
  test('resolve and call callback', async () => {
    const cb = jest.fn()
    const resp = await withCallback(async () => {
      return true
    }, cb)
    expect(resp).toEqual(true)
    expect(cb).toHaveBeenCalledWith(null, true)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  test('reject and call callback', async () => {
    const cb = jest.fn()
    const error = new Error('Thrown error!')
    const resp = withCallback(async () => {
      throw error
    }, cb)
    await expect(resp).rejects.toThrowError('Thrown error!')
    expect(cb).toHaveBeenCalledWith(error)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  test('reject and call callback, non-async fn', async () => {
    const cb = jest.fn()
    const error = new Error('Thrown error!')
    const resp = withCallback(() => {
      throw error
    }, cb)
    await expect(resp).rejects.toThrowError('Thrown error!')
    expect(cb).toHaveBeenCalledWith(error)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  describe('mergeUpdates', () => {
    const date = new Date()
    let obj

    class CustomClass {
      constructor () {
        this.id = 'abc'
        this.options = { a: 1, b: { c: 2 } }
        this.date = date
      }
    }

    beforeEach(() => {
      obj = new CustomClass()
    })

    test('merge updates with class instance object', () => {
      mergeUpdates(obj, { id: '123' })
      expect(obj.id).toEqual('123')
    })

    test('merge updates with class instance object (deep)', () => {
      mergeUpdates(obj, { id: '123', options: { b: { c: 1 } } })
      expect(obj).toMatchObject({
        id: '123',
        date,
        options: { a: 1, b: { c: 1 } },
      })
    })

    test('merge updates with class instance object (with date)', () => {
      const newDate = new Date()
      mergeUpdates(obj, { id: '123', date: newDate })
      expect(obj).toMatchObject({
        id: '123',
        date: newDate,
        options: { a: 1, b: { c: 2 } },
      })
    })

    test('no merge for unknown props', () => {
      mergeUpdates(obj, { randomProp: 10 })
      expect(obj).toMatchObject(obj)
    })
  })
})
