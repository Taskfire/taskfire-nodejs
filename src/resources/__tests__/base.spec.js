import BaseResource from '../base'
import Client from '../../client'

jest.mock('../../client')

class Wrapper {}

describe('queues', () => {
  let client
  let base

  beforeEach(() => {
    client = new Client()
    base = new BaseResource(client)
    base.model = Wrapper
  })

  test('should throw if no client provided', () => {
    expect(() => new BaseResource()).toThrowErrorMatchingSnapshot()
  })

  test('alias of delete to del', () => {
    class Ext extends BaseResource {
      delete () { this.x = 1 }
    }
    expect(new Ext(client)).toHaveProperty('del')
  })

  test('request delegates to client request', async () => {
    const req = {
      method: 'GET',
      url: '/tasks/task1',
    }
    client.request.mockResolvedValueOnce({
      body: {
        id: 'task1',
      },
    })

    await base._request(req)

    expect(client.request).toHaveBeenCalledTimes(1)
    expect(client.request).toHaveBeenCalledWith(req)
  })

  test('request wraps object response in Task', async () => {
    client.request.mockResolvedValueOnce({
      body: {
        id: 'task1',
      },
    })

    const resp = await base._request({
      method: 'GET',
      url: '/tasks/task1',
    })

    expect(resp).toBeInstanceOf(Wrapper)
  })

  test('request wraps array response in Task array', async () => {
    client.request.mockResolvedValueOnce({
      body: [{
        id: 'task1',
      }],
    })

    const resp = await base._request({
      method: 'GET',
      url: '/tasks/task1',
    })

    expect(resp).toHaveLength(1)
    expect(resp[0]).toBeInstanceOf(Wrapper)
  })
})
