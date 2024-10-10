# express-sse

> Easy Server-Sent Events for Express.js

## What's this?

express-sse is a neat little package that makes working with Server-Sent Events (SSE) in Express.js a breeze. It gives you a simple pub/sub system for real-time, one-way communication from your server to clients. No more headaches setting up SSE endpoints or managing subscriptions!

## Getting Started

First, grab the package:

```bash
npm install @dachendev/express-sse
```

## How to Use

### Quick Start

Here's the simplest way to get going:

```javascript
const express = require('express')
const { expressSSE } = require('express-sse')

const app = express()
const { router, broker } = expressSSE(app)

router.sse('/events', (sse, req, res) => {
  sse.send('Hello, SSE!')
  sse.send({ message: 'I can send JSON too!', time: new Date() })
})
```

### Real-world Scenario

Let's say you want to push updates to your clients:

```javascript
const express = require('express')
const { expressSSE } = require('express-sse')

const app = express()
const { router, broker } = expressSSE(express.Router())

router.sse('/events', (sse, req, res) => {
  sse.comment('Waiting for updates...')
  sse.subscribe('updates', (data) => sse.send(data))
})

app.post('/update', (req, res) => {
  broker.publish('updates', { type: 'update', data: req.body })
  res.json({ success: true })
})

app.use(router)
```

### Advanced Usage

Need more control? You can use the middlewares separately:

```javascript
const express = require('express')
const { sseMiddleware, sseBrokerMiddleware, Broker } = require('express-sse')

const app = express()
const broker = new Broker()

app.get('/sse-only', sseMiddleware(), (req, res) => {
  req.sse.send('Using just the SSE middleware')
})

app.get('/sse-with-broker', sseBrokerMiddleware(broker), (req, res) => {
  req.sse.comment('Using both middlewares')
  req.sse.subscribe('updates', (data) => req.sse.send(data))
})

app.post('/publish', (req, res) => {
  broker.publish('updates', req.body)
  res.json({ success: true })
})
```

## API Quick Reference

- `expressSSE(router, options)`: Sets up your router with SSE superpowers.
- `router.sse(path, ...middlewares, handler)`: Creates an SSE endpoint.
- `sse.send(data)`: Sends data (string or object) to the client.
- `sse.comment(text)`: Sends a comment to the client (useful for keeping connections alive).
- `sse.subscribe(topic, callback)`: Listens for updates on a topic.
- `sse.unsubscribe(topic, id)`: Stops listening to a topic.
- `sse.unsubscribeAll()`: Unsubscribes from everything.
- `broker.publish(topic, data)`: Broadcasts data to all subscribers of a topic.

That's it! Now go build some awesome real-time features with express-sse. If you run into any issues or have questions, feel free to open an issue on GitHub. Happy coding!
