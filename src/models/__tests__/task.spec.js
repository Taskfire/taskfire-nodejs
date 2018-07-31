import Task from '../task'
import TaskResources from '../../resources/tasks'
import Client from '../../client'

jest.mock('../../client')
jest.mock('../../resources/tasks')

describe('tasks.spec', () => {
  let client
  let task

  beforeEach(() => {
    client = new Client()
    client.tasks = new TaskResources(client)
    task = new Task(client, {
      id: 'task1',
      name: 'Task 1',
      queue: 'queue1',
    })
  })

  test('task should be instance of Task', () => {
    expect(task).toBeInstanceOf(Task)
  })

  test('throw if no client provided', () => {
    expect(() => new Task()).toThrowErrorMatchingSnapshot()
  })

  test('progress delegates to client', () => {
    const cb = () => {}
    task.progress(10, cb)
    expect(client.tasks.progress).toHaveBeenCalledTimes(1)
    expect(client.tasks.progress).toHaveBeenCalledWith('task1', 10, cb)
  })

  test('delete delegates to client', () => {
    const cb = () => {}
    task.delete({ a: 1 }, cb)
    expect(client.tasks.delete).toHaveBeenCalledTimes(1)
    expect(client.tasks.delete).toHaveBeenCalledWith('task1', { a: 1 }, cb)
  })

  test('delete is aliased as del', async () => {
    expect(task.del).toEqual(task.delete)
  })

  test('update delegates to client', () => {
    const cb = () => {}
    task.update({ name: 'New name' }, cb)
    expect(client.tasks.update).toHaveBeenCalledTimes(1)
    expect(client.tasks.update).toHaveBeenCalledWith('task1', { name: 'New name' }, cb)
  })

  xtest('update resolves to original task', () => {})
  xtest('update updates original task', () => {})

  test('error delegates to client', () => {
    const cb = () => {}
    const error = new Error('Error')
    task.error(error, cb)
    expect(client.tasks.error).toHaveBeenCalledTimes(1)
    expect(client.tasks.error).toHaveBeenCalledWith('task1', 'queue1', error, cb)
  })

  test('complete delegates to client', () => {
    const cb = () => {}
    task.complete({ x: 1 }, cb)
    expect(client.tasks.complete).toHaveBeenCalledTimes(1)
    expect(client.tasks.complete).toHaveBeenCalledWith('task1', 'queue1', { x: 1 }, cb)
  })

  test('update record merges updates', async () => {
    task._updateRecord({ name: 'Updated Name' })
    expect(task.name).toEqual('Updated Name')
  })

  test('update record should emit change', () => {
    const fn = jest.fn()
    task.on('change', fn)
    task._updateRecord({ name: 'Updated Name' })
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(task, { name: 'Updated Name' }, {
      id: 'task1',
      name: 'Task 1',
    })
  })

  test('toJSON exports a new plain object', () => {
    expect(task.toJSON()).toEqual({
      id: 'task1',
      name: 'Task 1',
    })
  })

  test('toString prints queueId', () => {
    expect(task.toString()).toEqual('<Task task1>')
  })
})
