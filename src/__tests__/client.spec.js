import { nextTick } from 'promise-callbacks'
import request from 'request'
import TaskResources from '../resources/tasks'
import RunResources from '../resources/runs'
import Client from '../client'

jest.mock('request')
jest.mock('../resources/tasks')

const apiKey = 'testKey'

describe('client', () => {
  let client

  beforeEach(async () => {
    jest.clearAllMocks()
    client = new Client(apiKey)
  })

  test('client is instance of Client', () => {
    expect(client).toBeInstanceOf(Client)
  })

  test('error if no apiKey provided to client', () => {
    expect(() => new Client()).toThrowErrorMatchingSnapshot()
  })

  test('creates tasks API on client', () => {
    expect(client.tasks).toBeInstanceOf(TaskResources)
    expect(client.tasks.create).toEqual(expect.any(Function))
    expect(client.tasks.update).toEqual(expect.any(Function))
    expect(client.tasks.delete).toEqual(expect.any(Function))
    expect(client.tasks.get).toEqual(expect.any(Function))
  })

  test('creates runs API on client', () => {
    expect(client.runs).toBeInstanceOf(RunResources)
    expect(client.runs.get).toEqual(expect.any(Function))
  })

  test('sends a request', async () => {
    const req = {
      method: 'GET',
      url: '/path',
      body: { a: 1 },
      query: { limit: 1 },
    }

    client.request(req)

    await nextTick()

    expect(request).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith(expect.objectContaining({
      auth: { user: apiKey, pass: '' },
      query: { limit: 1 },
      body: { a: 1 },
      url: '/path',
    }))
  })

  test('sends a request with projectId', async () => {
    client = new Client(apiKey, {
      projectId: 'x123',
    })

    const req = {
      method: 'GET',
      url: '/path',
      body: { a: 1 },
      query: { limit: 1 },
    }

    client.request(req)

    await nextTick()

    expect(request).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith(expect.objectContaining({
      auth: { user: apiKey, pass: '' },
      query: { limit: 1, projectId: 'x123' },
      body: { a: 1 },
      url: '/path',
    }))
  })

  /* eslint-disable no-console */
  test('logs in debug mode', () => {
    const _log = console.log
    client = new Client(apiKey, { debug: true })
    console.log = jest.fn()
    client._log('test', 'param1', { a: 1 })
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log.mock.calls).toMatchSnapshot()
    console.log = _log
  })

  test('does not log in non-debug mode', () => {
    const _log = console.log
    console.log = jest.fn()
    client._log('test', 'param1', { a: 1 })
    expect(console.log).not.toHaveBeenCalled()
    console.log = _log
  })
  /* eslint-enable no-console */
})
