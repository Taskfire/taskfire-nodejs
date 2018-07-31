import QueueResources from '../queues'
import TaskResources from '../tasks'
import Client from '../../client'
import Queue from '../../models/queue'
import Task from '../../models/task'

jest.mock('../../client')
jest.mock('../../models/queue')
jest.mock('../../models/task')
jest.mock('../tasks')

describe('queues', () => {
  let queues
  let client
  let req

  beforeEach(() => {
    req = { method: 'GET', path: '/path' }
    client = new Client()
    queues = new QueueResources(client)
  })

  test('queues is instance of QueueResources', () => {
    expect(queues).toBeInstanceOf(QueueResources)
  })

  test('queues has the required public API', () => {
    expect(queues.create).toEqual(expect.any(Function))
    expect(queues.update).toEqual(expect.any(Function))
    expect(queues.delete).toEqual(expect.any(Function))
    expect(queues.del).toEqual(expect.any(Function))
    expect(queues.get).toEqual(expect.any(Function))
    expect(queues.list).toEqual(expect.any(Function))
    expect(queues.push).toEqual(expect.any(Function))
    expect(queues.worker).toEqual(expect.any(Function))
    expect(queues.removeWorker).toEqual(expect.any(Function))
  })

  test('queue request calls client request', () => {
    client.request.mockResolvedValueOnce({ body: { id: 'super-queue' } })
    queues._request(req)
    expect(client.request).toHaveBeenCalledWith(req)
  })

  test('queue request adds queue wrapper to response object', async () => {
    client.request.mockResolvedValueOnce({ body: { id: 'super-queue' } })
    const resp = await queues._request(req)
    expect(resp).toBeInstanceOf(Queue)
  })

  test('queue request adds queue wrapper to response array', async () => {
    client.request.mockResolvedValueOnce({ body: [{ id: 'super-queue' }] })
    const resp = await queues._request(req)
    expect(resp[0]).toBeInstanceOf(Queue)
  })

  test('queue calls cb with response object', async () => {
    const fn = jest.fn()
    client.request.mockResolvedValueOnce({ body: { id: 'super-queue' } })
    await queues._request(req, fn)
    expect(fn).toHaveBeenCalledWith(null, expect.any(Queue))
  })

  // test('queue updates existing queue record if it exists', async () => {
  //   client.request.mockResolvedValueOnce({ body: { id: 'x1', a: 2 } })
  //   const queue = new Queue(client, { id: 'x1', a: 1 })
  //   queues.workers.set('x1', queue)
  //   const resp = await queues._request(req)
  //   expect(resp).toBeInstanceOf(Queue)
  //   expect(queue._updateRecord).toHaveBeenCalledWith({ id: 'x1', a: 2 })
  // })

  describe('Basic API', () => {
    beforeEach(() => {
      queues._request = jest.fn()
    })

    test('create sends request', () => {
      queues.create({ x: 1 })
      expect(queues._request).toHaveBeenCalledTimes(1)
      expect(queues._request.mock.calls).toMatchSnapshot()
    })

    test('update sends request', () => {
      queues.update('queueId', { x: 1 })
      expect(queues._request).toHaveBeenCalledTimes(1)
      expect(queues._request.mock.calls).toMatchSnapshot()
    })

    test('delete sends request', () => {
      queues.delete('queueId')
      expect(queues._request).toHaveBeenCalledTimes(1)
      expect(queues._request.mock.calls).toMatchSnapshot()
    })

    test('delete removes queue', async () => {
      client.request.mockResolvedValueOnce({ body: { id: '1' } })
      queues.workers.set('1', new Queue({ id: '1' }))
      await queues.delete('1')
      expect(queues.workers.has('1')).toEqual(false)
    })

    test('get sends request', () => {
      queues.get('queueId')
      expect(queues._request).toHaveBeenCalledTimes(1)
      expect(queues._request.mock.calls).toMatchSnapshot()
    })

    test('list sends request', () => {
      queues.list('queueId', { x: 1 })
      expect(queues._request).toHaveBeenCalledTimes(1)
      expect(queues._request.mock.calls).toMatchSnapshot()
    })

    test('worker sends request', () => {
      queues._request.mockResolvedValueOnce(new Queue(client, { id: '1' }))
      queues.worker('queueId', () => {})
      expect(queues._request).toHaveBeenCalledTimes(1)
      expect(queues._request.mock.calls).toMatchSnapshot()
    })

    test('removeWorker sends request', () => {
      queues._request.mockResolvedValueOnce(new Queue(client, { id: '1' }))
      queues.removeWorker('queueId')
      expect(queues._request).toHaveBeenCalledTimes(1)
      expect(queues._request.mock.calls).toMatchSnapshot()
    })

    test('removeWorker removes from list of workers', async () => {
      queues._request.mockResolvedValueOnce(new Queue(client, { id: '1' }))
      await queues.removeWorker('queueId')
      expect(queues.workers.has('queueId')).toBe(false)
    })

    test('push delegates to tasks API', () => {
      client.tasks = new TaskResources(client)
      queues.push('queueId', { name: 'New Job!' })
      expect(client.tasks.create).toHaveBeenCalledTimes(1)
      expect(client.tasks.create.mock.calls[0][0].queue).toEqual('queueId')
      expect(client.tasks.create.mock.calls).toMatchSnapshot()
    })
  })

  describe('Worker API', () => {
    beforeEach(() => {
      client.request.mockResolvedValue({ body: { id: 'queue1' } })
    })

    test('creates a new worker', async () => {
      const queue = await queues.worker('queue1', () => {})
      expect(queue).toBeInstanceOf(Queue)
    })

    test('adds worker to the queue worker store', async () => {
      await queues.worker('queue1', () => {})
      expect(queues.workers.get('queue1')).toBeInstanceOf(Function)
    })

    test('process work for queue (async with success)', async () => {
      let task
      const handler = jest.fn().mockImplementationOnce((_task) => {
        _task.complete.mockResolvedValueOnce(10)
        task = _task
      })
      // queues._request.mockResolvedValue({})
      await queues.worker('queue1', handler)
      const resp = await queues._processWork({ id: 'task1', data: { a: 1 }, queue: 'queue1' })
      expect(resp).toEqual(10)
      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(expect.any(Task))
      expect(task.complete).toHaveBeenCalledTimes(1)
    })

    test('process work for queue (async with error)', async () => {
      let task
      const handler = jest.fn().mockImplementationOnce(async (_task) => {
        _task.error.mockResolvedValueOnce(11)
        task = _task
        throw new Error('Some error!')
      })
      // queues._request.mockResolvedValue({})
      await queues.worker('queue1', handler)
      const resp = await queues._processWork({ id: 'task1', data: { a: 1 }, queue: 'queue1' })
      expect(resp).toEqual(11)
      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(expect.any(Task))
      expect(task.error).toHaveBeenCalledTimes(1)
    })

    test('throws if queue is already a worker', async () => {
      await queues.worker('queue1', () => {})
      expect(queues.worker('queue1', () => {})).rejects.toThrowErrorMatchingSnapshot()
    })

    test('process work should error if not a worker', () => {
      expect(queues._processWork({ id: 'task1', data: { a: 1 }, queue: 'queue2' }))
        .rejects.toThrowErrorMatchingSnapshot()
    })

    xtest('close removes the queue from the list of queues', () => {})
  })
  // test('queue should be stored ')
})
