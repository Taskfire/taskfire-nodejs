import TaskResources from '../tasks'
import Client from '../../client'

jest.mock('../../client')

describe('tasks', () => {
  let tasks
  let client
  let req

  beforeEach(() => {
    req = { method: 'GET', path: '/path' }
    client = new Client()
    tasks = new TaskResources(client)
  })

  test('tasks is instance of TaskResources', () => {
    expect(tasks).toBeInstanceOf(TaskResources)
  })

  test('tasks has the required public API', () => {
    expect(tasks.create).toEqual(expect.any(Function))
    expect(tasks.update).toEqual(expect.any(Function))
    expect(tasks.delete).toEqual(expect.any(Function))
    expect(tasks.del).toEqual(expect.any(Function))
    expect(tasks.get).toEqual(expect.any(Function))
    expect(tasks.list).toEqual(expect.any(Function))
  })

  test('tasks request calls client request', () => {
    client.request.mockResolvedValueOnce({ body: { id: 'super-queue' } })
    tasks._request(req)
    expect(client.request).toHaveBeenCalledWith(req)
  })

  test('tasks calls cb with response object', async () => {
    const fn = jest.fn()
    client.request.mockResolvedValueOnce({ body: { id: 'super-queue' } })
    await tasks._request(req, fn)
    expect(fn).toHaveBeenCalledWith(null, { id: 'super-queue' })
  })

  describe('Basic API', () => {
    beforeEach(() => {
      tasks._request = jest.fn()
    })

    test('create sends request', () => {
      tasks.create({ x: 1 })
      expect(tasks._request).toHaveBeenCalledTimes(1)
      expect(tasks._request.mock.calls).toMatchSnapshot()
    })

    test('update sends request', () => {
      tasks.update('taskId', { x: 1 })
      expect(tasks._request).toHaveBeenCalledTimes(1)
      expect(tasks._request.mock.calls).toMatchSnapshot()
    })

    test('delete sends request', () => {
      tasks.delete('taskId')
      expect(tasks._request).toHaveBeenCalledTimes(1)
      expect(tasks._request.mock.calls).toMatchSnapshot()
    })

    test('get sends request', () => {
      tasks.get('taskId')
      expect(tasks._request).toHaveBeenCalledTimes(1)
      expect(tasks._request.mock.calls).toMatchSnapshot()
    })

    test('list sends request', () => {
      tasks.list('taskId', { x: 1 })
      expect(tasks._request).toHaveBeenCalledTimes(1)
      expect(tasks._request.mock.calls).toMatchSnapshot()
    })
  })
})
