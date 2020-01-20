const { verifyRefreshToken, createSessionToken } = require('../modules/auth')
const { sanitize } = require('../utils')

const refreshTokenHandler = async (req, res) => {
  const returnError = () => {
    res.body = {
      error: 'Forbidden',
    }
    return res.status(403).send(req.body)
  }

  if (!req.cookies.token) {
    returnError()
  }

  // check if client sent a cookie
  const refreshToken = sanitize(req.cookies.token)
  const userid = await verifyRefreshToken(refreshToken)

  if (!userid) {
    // clear cookie
    res.clearCookie('token')
    returnError()
  }

  // retrieve userid for this refreshToken
  const accessToken = await createSessionToken(userid)

  return res.status(200).send({
    token: accessToken,
  })
}

module.exports = refreshTokenHandler
