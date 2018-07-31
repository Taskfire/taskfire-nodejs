import { nextTick } from 'promise-callbacks'
import EventEmitter from 'events'
import WebSocket from 'ws'
import QueueResources from '../resources/queues'
import TaskResources from '../resources/tasks'
import Client from '../client'

jest.mock('ws')
jest.mock('../resources/queues')

const apiKey = 'testKey'
const filterHandlers = (client, handlerType) =>
  client.ws.on.mock.calls.filter(([type]) => type === handlerType)

describe('client', () => {
  let client

  beforeEach(async () => {
    jest.clearAllMocks()
    client = new Client(apiKey)
    client.on('error', (err) => { throw err })
    client.ready = Promise.resolve(true)
  })

  test('client is instance of Client', () => {
    expect(client).toBeInstanceOf(Client)
  })

  test('client is instance of EventEmitter', () => {
    expect(client).toBeInstanceOf(EventEmitter)
  })

  test('error if no apiKey provided to client', () => {
    expect(() => new Client()).toThrowErrorMatchingSnapshot()
  })

  test('creates a websocket on init', () => {
    expect(client.ws).toBeInstanceOf(WebSocket)
  })

  test('emits websocket errors', () => {
    expect(client.ws.on.mock.calls[0]).toEqual(['error', expect.any(Function)])
  })

  test('ready resolves when ws is open', async () => {
    const openCalls = filterHandlers(client, 'open')
    expect(client.ready).toBeInstanceOf(Promise)
    expect(openCalls).toHaveLength(1)

    openCalls[0][1]() // Open

    await expect(client.ready).resolves.toEqual(true)
  })

  test('open is emitted on open', async () => {
    const fn = jest.fn()
    const openCalls = filterHandlers(client, 'open')
    client.on('open', fn)

    openCalls[0][1]() // Open

    await client.ready

    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('closes connection and resolves', () => {
    const promise = client.close()
    const resolver = client.ws.once.mock.calls[0][1]
    resolver()
    expect(promise).resolves.toEqual(undefined)
    expect(client.ws.close).toHaveBeenCalledTimes(1)
  })

  test('creates project API on client', () => {})

  test('creates queue API on client', () => {
    expect(client.queues).toBeInstanceOf(QueueResources)
    expect(client.queues.create).toEqual(expect.any(Function))
    expect(client.queues.update).toEqual(expect.any(Function))
    expect(client.queues.delete).toEqual(expect.any(Function))
    expect(client.queues.get).toEqual(expect.any(Function))
  })

  test('creates tasks API on client', () => {
    expect(client.tasks).toBeInstanceOf(TaskResources)
    expect(client.tasks.create).toEqual(expect.any(Function))
    expect(client.tasks.update).toEqual(expect.any(Function))
    expect(client.tasks.delete).toEqual(expect.any(Function))
    expect(client.tasks.get).toEqual(expect.any(Function))
  })

  test('sends raw message', async () => {
    client.ws.send.mockImplementationOnce((msg, cb) => cb(null, true))
    await client._send({ a: 1 })
    expect(client.ws.send).toHaveBeenCalledTimes(1)
    expect(client.ws.send.mock.calls[0][0]).toEqual(JSON.stringify({ a: 1 }))
    expect(client.ws.send.mock.calls).toMatchSnapshot()
  })

  test('send raw message with invalid JSON', async () => {
    const obj = { x: 1, toJSON: () => { throw new Error('Test error') } }
    await expect(client._send(obj)).rejects.toThrowErrorMatchingSnapshot()
  })

  test('sends a request', async () => {
    const req = {
      method: 'GET',
      url: '/path',
      body: { a: 1 },
      query: { limit: 1 },
    }

    const fn = jest.fn()
    client._send = fn
    client.request(req)

    await nextTick()

    expect(client.requests.has(1)).toBe(true)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith({
      ...req,
      requestId: 1,
    })
  })

  test('sends a request and resolves promise on response', async () => {
    const fn = jest.fn()
    const promise = client.request({
      url: '/path',
      method: 'GET',
    }, fn)

    const resp = {
      type: 'RESPONSE',
      requestId: 1,
      status: 200,
      body: { x: 1 },
    }

    await nextTick()

    client._receive(JSON.stringify(resp))

    await expect(promise).resolves.toEqual(resp)
    expect(fn).toHaveBeenCalledWith(null, resp)
    expect(client.requests.has(1)).toBe(false)
  })

  test('sends a request and rejects promise on response', async () => {
    const promise = client.request({
      url: '/path',
      method: 'GET',
    })

    const resp = {
      type: 'RESPONSE',
      requestId: 1,
      status: 400,
      body: { error: 1 },
    }

    await nextTick()

    client._receive(JSON.stringify(resp))

    await expect(promise).rejects.toEqual(resp)
    expect(client.requests.has(1)).toBe(false)
  })

  test('sends subscription event to worker', async () => {
    const resp = {
      type: 'WORK',
      body: { x: 1 },
    }
    client._receive(JSON.stringify(resp))

    expect(client.queues._processWork).toHaveBeenCalledWith(resp)
  })

  test('sends an unexpected event type from the server', () => {
    const resp = {
      type: 'UNKNOWN',
      body: { x: 1 },
    }

    expect(() => client._receive(JSON.stringify(resp))).toThrowErrorMatchingSnapshot()
  })

  test('throws error if response is not in request map', () => {
    const resp = JSON.stringify({
      type: 'RESPONSE',
      requestId: 1,
      body: { x: 1 },
    })

    expect(() => client._receive(resp)).toThrowErrorMatchingSnapshot()
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
