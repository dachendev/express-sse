const sseMiddleware = (opts = {}) => {
  const hbInterval = opts.heartbeatInterval || 30000

  return (req, res, next) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    })

    const sse = {
      comment: (text) => {
        res.write(`: ${text}\n\n`)
      },
      send: (data) => {
        const dataStr = typeof data === 'object' ? JSON.stringify(data) : data
        res.write(`data: ${dataStr}\n\n`)
      },
    }

    sse.comment('stream')

    const hb = setInterval(() => {
      sse.comment('heartbeat')
    }, hbInterval)

    req.on('close', () => {
      clearInterval(hb)
      res.end()
    })

    req.sse = sse
    next()
  }
}

module.exports = sseMiddleware
