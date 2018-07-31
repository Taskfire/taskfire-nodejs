import Base from '../base'
import Client from '../../client'

jest.mock('../../client')

describe('models/base', () => {
  let client

  beforeEach(() => {
    client = new Client()
  })

  test('alias of delete to del', () => {
    class Ext extends Base {
      delete () { this.x = 1 }
    }
    expect(new Ext(client)).toHaveProperty('del')
  })
})
