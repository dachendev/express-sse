const Broker = require('./Broker')
const sseBrokerMiddleware = require('./sseBrokerMiddleware')

const expressSSE = (router, opts = {}) => {
  const broker = new Broker()

  router.sse = (path, ...args) => {
    const handler = args.pop()
    const middlewares = args

    middlewares.push(sseBrokerMiddleware(broker, opts))

    router.get(path, ...middlewares, (req, res, next) => {
      handler(req.sse, req, res, next)
    })
  }

  return { router, broker }
}

module.exports = expressSSE
