import Queue from '../queue'
import QueueResources from '../../resources/queues'
import Client from '../../client'

jest.mock('../../client')
jest.mock('../../resources/queues')

describe('queue.spec', () => {
  let client
  let queue

  beforeEach(() => {
    client = new Client()
    client.queues = new QueueResources(client)
    queue = new Queue(client, {
      id: 'queue1',
      name: 'Queue Name',
    })
  })

  test('queue is instance of Queue', () => {
    expect(queue).toBeInstanceOf(Queue)
  })

  test('throw if no client provided', () => {
    expect(() => new Queue()).toThrowErrorMatchingSnapshot()
  })

  test('delete delegates to client', () => {
    const cb = () => {}
    queue.delete({ a: 1 }, cb)
    expect(client.queues.delete).toHaveBeenCalledTimes(1)
    expect(client.queues.delete).toHaveBeenCalledWith('queue1', { a: 1 }, cb)
  })

  test('delete is aliased as del', async () => {
    expect(queue.del).toEqual(queue.delete)
  })

  test('worker delegates to client', () => {
    const cb = () => {}
    queue.worker({ a: 1 }, cb)
    expect(client.queues.worker).toHaveBeenCalledTimes(1)
    expect(client.queues.worker).toHaveBeenCalledWith('queue1', { a: 1 }, cb)
  })


  test('removeWorker delegates to client', async () => {
    client.queues.removeWorker.mockResolvedValueOnce(10)
    const cb = () => {}
    queue.removeWorker(cb)
    expect(client.queues.removeWorker).toHaveBeenCalledTimes(1)
    expect(client.queues.removeWorker).toHaveBeenCalledWith('queue1', cb)
  })

  test('update record merges updates', async () => {
    queue._updateRecord({ name: 'Updated Name' })
    expect(queue.name).toEqual('Updated Name')
  })

  test('update record should emit change', () => {
    const fn = jest.fn()
    queue.on('change', fn)
    queue._updateRecord({ name: 'Updated Name' })
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(queue, { name: 'Updated Name' }, {
      id: 'queue1',
      name: 'Queue Name',
    })
  })

  test('toJSON exports a new plain object', () => {
    expect(queue.toJSON()).toEqual({
      id: 'queue1',
      name: 'Queue Name',
      createdAt: undefined,
    })
  })

  test('toString prints queueId', () => {
    expect(queue.toString()).toEqual('<Queue queue1>')
  })
})
