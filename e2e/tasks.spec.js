import client from '../src'
import Client from '../src/client'

const key = process.env.TEST_API_KEY
const url = process.env.TEST_URL
const projectId = process.env.TEST_PROJECT_ID
// const date = new Date()

describe('e2e/tasks', () => {
  jest.setTimeout(10000)

  let cli

  beforeEach(() => {
    cli = client(key, { debug: true, url, projectId })

    return cli.request({
      method: 'DELETE',
      url: `/projects/${projectId}/_resetAllData`,
    })
  })

  test('client is instance of Client', () => {
    expect(cli).toBeInstanceOf(Client)
  })

  test('create a new task', async () => {
    const task = await cli.tasks.create({ name: 'Task Name' })
    expect(task).toMatchObject({
      id: task.id,
      name: 'Task Name',
      createdAt: expect.any(String),
    })
  })

  test('get a task', async () => {
    const task = await cli.tasks.create({ name: 'Task Name' })
    const task2 = await cli.tasks.get(task.id)
    expect(task2).toMatchObject({
      id: task.id,
      name: 'Task Name',
    })
  })

  test('get a list of queues', async () => {
    const task = await cli.tasks.create({ name: 'Task Name' })
    const tasks = await cli.tasks.list()
    expect(tasks).toHaveLength(1)
    expect(tasks[0]).toMatchObject({
      id: task.id,
      name: 'Task Name',
    })
  })

  test('delete a queue', async () => {
    const task = await cli.tasks.create({ name: 'Task Name' })
    const { id } = await cli.tasks.delete(task.id, { force: '1' })
    const tasks = await cli.tasks.list()
    expect(task).toMatchObject({ id })
    expect(tasks).toHaveLength(0)
  })
})
