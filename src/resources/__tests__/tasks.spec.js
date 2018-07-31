// import { nextTick } from 'promise-callbacks'
import TaskResources from '../tasks'
import Client from '../../client'
// import Task from '../../models/task'
// import Queue from '../../Queue'

jest.mock('../../client')

describe('tasks', () => {
  let tasks
  let client

  beforeEach(() => {
    client = new Client()
    tasks = new TaskResources(client)
  })

  test('tasks is instance of TaskResource', () => {
    expect(tasks).toBeInstanceOf(TaskResources)
  })

  test('tasks has the required public API', () => {
    expect(tasks.create).toEqual(expect.any(Function))
    expect(tasks.update).toEqual(expect.any(Function))
    expect(tasks.delete).toEqual(expect.any(Function))
    expect(tasks.del).toEqual(expect.any(Function))
    expect(tasks.get).toEqual(expect.any(Function))
    expect(tasks.list).toEqual(expect.any(Function))
    expect(tasks.progress).toEqual(expect.any(Function))
  })

  describe('Basic API', () => {
    beforeEach(() => {
      tasks._request = jest.fn()
    })

    test('create sends request', () => {
      tasks.create({ queue: 'fantastic-queue' })
      expect(tasks._request).toHaveBeenCalledTimes(1)
      expect(tasks._request.mock.calls).toMatchSnapshot()
    })

    test('create should reject if no queueId provided', async () => {
      await expect(tasks.create({})).rejects.toThrowErrorMatchingSnapshot()
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

    test('progress sends request', () => {
      tasks.progress('taskId', 10)
      expect(tasks._request).toHaveBeenCalledTimes(1)
      expect(tasks._request.mock.calls).toMatchSnapshot()
    })

    test('error sends request', () => {
      tasks.error('taskId', 'queue1')
      expect(tasks._request).toHaveBeenCalledTimes(1)
      expect(tasks._request.mock.calls).toMatchSnapshot()
    })

    test('complete sends request', () => {
      tasks.complete('taskId', 'queue1')
      expect(tasks._request).toHaveBeenCalledTimes(1)
      expect(tasks._request.mock.calls).toMatchSnapshot()
    })
  })
})
