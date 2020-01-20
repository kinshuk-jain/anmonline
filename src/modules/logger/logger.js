const morgan = require('morgan')
const { maskUserDataFromRequestBody } = require('./mask-log')

morgan.token('req-res', (req, res) => {
  return JSON.stringify({
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      headers: req.headers,
      body: maskUserDataFromRequestBody(req.body),
    },
    response: {
      status: res.statusCode,
      headers: res.headers,
      body: res.body,
    },
  })
})

const logger = morgan(
  ':remote-user [:date[clf]] ":referrer" "HTTP/:http-version" Duration :response-time ms :req-res'
)

module.exports = logger
