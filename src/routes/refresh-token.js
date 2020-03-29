const { verifyRefreshToken, createSessionToken } = require('../modules/auth')
const { sanitize } = require('../utils')

const refreshTokenHandler = async (req, res) => {
  const returnError = () => {
    res.body = {
      error: 'Forbidden',
    }
    return res.status(401).send({ error: 'Forbidden' })
  }

  if (!req.cookies.token) {
    return returnError()
  }

  // check if client sent a cookie
  const refreshToken = sanitize(req.cookies.token)
  const userid = await verifyRefreshToken(refreshToken)

  if (!userid) {
    // clear cookie
    res.clearCookie('token')
    return returnError()
  }

  // get new access token
  const accessToken = await createSessionToken(userid)

  return res.status(200).send({
    token: accessToken,
  })
}

module.exports = refreshTokenHandler
