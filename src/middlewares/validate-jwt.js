const { verifySessionToken } = require('../modules/auth')

async function validateAuthToken(req, res, next) {
  const sendErrorResponse = () => {
    res.set('WWW-Authenticate', 'Bearer realm="Authorization Required"')
    res.body = {
      error: 'Authorization Required',
    }
    return res.status(401).send(res.body)
  }

  // extract token from authorization header
  const header = req.get('authorization')
  if (!header) {
    sendErrorResponse()
  }

  const token = header.split(' ').pop()

  try {
    const decodedToken = await verifySessionToken(token)
    req.userid = decodedToken.aud
    next()
  } catch (e) {
    console.error({
      type: 'Failed verifying session token',
      message: e.message,
      stack: e.stack,
    })
    sendErrorResponse()
  }
}

module.exports = {
  validateAuthToken,
}
