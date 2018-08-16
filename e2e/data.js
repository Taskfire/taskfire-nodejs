import client from '../src'

const key = process.env.TEST_API_KEY
const url = process.env.TEST_URL

export function resetData () {
  return cli.request({
    method: 'DELETE',
    url: '/projects/',
  })
}

export function createProject () {
  const cli = createClient()
  return cli.request({
    method: 'POST',
    url: '/projects',
  })
}

export function createClient () {
  return client(key, {
    debug: true,
    url,
  })
}
