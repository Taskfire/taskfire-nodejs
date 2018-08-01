import path from 'path'

/* istanbul ignore next */
const envFile = process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod'

/* istanbul ignore next */
// eslint-disable-next-line
require('dotenv').config({
  path: path.resolve(__dirname, envFile),
})

/* istanbul ignore next */
if (typeof process === 'object' && !global.unhandledRejection) {
  global.unhandledRejection = true
  process.on('unhandledRejection', (error) => {
    console.error(error)
    // throw error
  })
}
