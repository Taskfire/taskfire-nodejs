# Taskbird Node.js Library

[![Build Status](https://travis-ci.org/Taskbird/taskbird-node.svg?branch=master)](https://travis-ci.org/Taskbird/taskbird-node) [![Coverage Status](https://coveralls.io/repos/github/Taskbird/taskbird-node/badge.svg?branch=master)](https://coveralls.io/github/Taskbird/taskbird-node?branch=master)

Official NodeJS client for [Taskbird](https://taskbird.io). The library provides convenient access to the Taskbird API from applications written in server-side JavaScript (Node JS).

Please only use this with server-side Node as it uses your Taskbird project secret token (which should never be publicly revealed).

Install with:

```js
npm install taskbird
```

## Usage

The package needs to be configured with your project's secret token which is available in your project settings. You must instantiate a new client for each project you want to connect to.

Push a job into example-queue-id:

```js
const client = require('taskbird')('<secret_token>')
// OR import taskbird from 'taskbird'
// const client = taskbird(('<secret_token>')

const job = client.queues
  .push('example-queue-id', {
    data: { x: 🤖, y: 2 },
    retries: 3,
  })
  .progress((progress, job) => {
    // Things are moving along! ⏳
  })
  .then((job) => {
    // Work has been completed! 🎉
  })
```

Create a worker for example-queue-id:

```js
const client = require('taskbird')('<secret_token>')

client.queues
  .process('super-fly-queue', options, async (job, done) => {
    // Work on the queue and report progress
    job.progress(20)

    // Return a promise or call done,
    // when you're finished
    return 👍
  })
```


## API

The API allows either Promise or callbacks to be used.

### taskbird (secretAuthToken, options)

Helper function, returns a new instance of TaskbirdClient.


## TaskbirdClient (secretAuthToken, options)

Creates a new instance of the Taskbird client class.

#### `options` object properties

| Property    | Default        | Description |
|-------------|----------------|-------------|
| url         | [wss://api.taskbird.io] | The Taskbird API URL. |
| debug       | false          | Add additional console logs |


### queues.create (queue, cb) => Promise<Queue>

Creates a new queue.

`queue: Object` - properties for the new queue
- [id] - ID of the queue
- [name] - Name of the queue

`[cb]: Function` - callback which resolves with `Queue`


## Queue

Queue instances are returned by the client, and represent one queue. They have
convenience methods on them to make changes to the queue.



### Task

Task instances are returned by the client, and represent one task. They have
convenience methods on them to make changes to the task.


### Running Tests

Run (at project root):
`yarn test`
