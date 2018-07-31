import client from '../src'
import Client from '../src/client'

const key = process.env.TEST_API_KEY
const url = process.env.TEST_URL
const date = new Date()
const queueId = `queue-${+date}`

describe('e2e/queues', () => {
  jest.setTimeout(10000)

  let cli

  beforeAll(() => {
    cli = client(key, {
      debug: true,
      url, // 'ws://localhost:4000',
    })
    cli.on('error', (err) => {
      console.log(err)
    })
    // cli.ws.on('unexpected-response', (req, res) => {
    //   console.log(res)
    // })
    return cli.request({
      method: 'DELETE',
      url: '/project/_resetAllData',
    })
  })

  afterAll(() => {
    return cli.close()
  })

  test('client is instance of Client', () => {
    expect(cli).toBeInstanceOf(Client)
  })

  test('client is ready', async () => {
    cli.on('error', (err) => { throw err })
    await cli.ready
  })

  test('create a new queue', async () => {
    const queue = await cli.queues.create({
      id: queueId,
      name: 'Queue Name',
    })
    expect(queue).toMatchObject({
      id: queueId,
      name: 'Queue Name',
      createdAt: expect.any(String),
    })
  })

  test('get a queue', async () => {
    const queue = await cli.queues.get(queueId)
    expect(queue).toMatchObject({
      id: queueId,
      name: 'Queue Name',
    })
  })

  test('get a list of queues', async () => {
    const queues = await cli.queues.list()
    expect(queues).toHaveLength(1)
    expect(queues[0]).toMatchObject({
      id: queueId,
      name: 'Queue Name',
    })
  })

  test('push a task into the queue', async () => {
    const task = await cli.queues.push(queueId, {
      id: 'important-job',
      name: 'New Task',
    })
    expect(task).toMatchObject({
      id: 'important-job',
      name: 'New Task',
    })
  })

  test('process tasks from the queue - with success', async () => {
    const task = await new Promise((resolve) => {
      cli.queues.worker(queueId, (t) => {
        resolve(t)
        return {
          x: 1,
        }
      })
    })

    expect(task).toMatchObject({
      id: 'important-job',
      name: 'New Task',
    })

    await cli.queues.close(queueId)
  })

  test.only('process tasks from the queue - with error', async () => {
    await cli.queues.push(queueId, { id: 'error-job' })

    await new Promise((resolve) => {
      cli.queues.worker(queueId, (t) => {
        resolve(t)
        throw new Error('Error has occurred!')
      })
    })

    await cli.queues.close(queueId)

    const failedTasks = await cli.tasks.list({
      queue: queueId,
      status: 'FAILED',
    })

    expect(failedTasks).toHaveLength(1)
  })

  test('task is in complete list', async () => {
    const tasks = await cli.tasks.list({
      queue: queueId,
      status: 'COMPLETE',
    })

    expect(tasks).toHaveLength(1)
    expect(tasks[0]).toMatchObject({
      id: 'important-job',
      data: { x: 1 },
    })
  })

  test('delete a queue', async () => {
    const queue = await cli.queues.delete(queueId, { force: '1' })
    expect(queue).toMatchObject({ id: queueId })
  })
})
