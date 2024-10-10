const { compose } = require('compose-middleware')
const sseMiddleware = require('./sseMiddleware')

const sseBrokerMiddleware = (broker, opts = {}) => {
  const fn = (req, res, next) => {
    const subs = new Map()

    const nextSSE = {
      ...req.sse,
      subscribe: (topic, cb) => {
        const id = broker.subscribe(topic, cb)
        subs.set(topic, id)
        return id
      },
      unsubscribe: (topic, id) => {
        broker.unsubscribe(topic, id)
        subs.delete(topic)
      },
      unsubscribeAll: () => {
        subs.forEach((id, topic) => broker.unsubscribe(topic, id))
        subs.clear()
      },
    }

    req.on('close', nextSSE.unsubscribeAll)

    req.sse = nextSSE
    next()
  }

  return compose([sseMiddleware(opts), fn])
}

module.exports = sseBrokerMiddleware
