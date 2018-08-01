// import { nextTick } from 'promise-callbacks'
import RunResources from '../runs'
import Client from '../../client'

jest.mock('../../client')

describe('runs', () => {
  let runs
  let client

  beforeEach(() => {
    client = new Client()
    runs = new RunResources(client)
  })

  test('tasks is instance of TaskResource', () => {
    expect(runs).toBeInstanceOf(RunResources)
  })

  test('tasks has the required public API', () => {
    expect(runs.get).toEqual(expect.any(Function))
    expect(runs.list).toEqual(expect.any(Function))
  })

  describe('Basic API', () => {
    beforeEach(() => {
      runs._request = jest.fn()
    })

    test('get sends request', () => {
      runs.get('runId')
      expect(runs._request).toHaveBeenCalledTimes(1)
      expect(runs._request.mock.calls).toMatchSnapshot()
    })

    test('list sends request', () => {
      runs.list('taskId', { x: 1 })
      expect(runs._request).toHaveBeenCalledTimes(1)
      expect(runs._request.mock.calls).toMatchSnapshot()
    })
  })
})
