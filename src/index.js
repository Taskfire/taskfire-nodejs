import Client from './client'

const clients = new Map()

export default (apiKey, options) => {
  if (clients.has(apiKey)) return clients.get(apiKey)
  return new Client(apiKey, options)
}
