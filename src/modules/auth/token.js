const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const { JWT_EXPIRY_TIMEOUT } = require('../../constants/timers')
const { DBMethods, TableNames } = require('../db')

const privateKey = fs.readFileSync(
  path.join(global.rootPath, `config/${process.env.NODE_ENV}/private.pem`)
)
const publicKey = fs.readFileSync(
  path.join(global.rootPath, `config/${process.env.NODE_ENV}/public.pem`)
)

// create JWT when user logs in or sends refresh token
function createSessionToken(userid) {
  const sign = promisify(jwt.sign)
  return sign(
    {},
    { key: privateKey, passphrase: process.env.KEY_PASSWORD },
    {
      expiresIn: JWT_EXPIRY_TIMEOUT,
      audience: userid,
      issuer: process.env.MY_DOMAIN,
      algorithm: 'RS256',
    }
  )
    .then((token) => token)
    .catch((err) => {
      console.error({
        type: 'error signing token',
        message: err.message,
        stack: err.stack,
      })
    })
}

function verifySessionToken(token) {
  const verify = promisify(jwt.verify)
  const decodedToken = jwt.decode(token)

  return verify(token, publicKey, {
    audience: decodedToken.aud, // this is the userid
    issuer: process.env.MY_DOMAIN,
    algorithm: 'RS256',
  })
    .then((decoded) => decoded)
    .catch((err) => {
      console.error({
        type: 'error verifying token',
        message: err.message,
        stack: err.stack,
      })
    })
}

// create refresh token
async function createRefreshToken(userid) {
  const token = uuidv4()
  await DBMethods.addRecordInTable(TableNames.REFRESH_TOKEN, {
    refreshToken: token,
    userid,
  })
  await DBMethods.updateUserRefreshToken(userid, token)
  return token
}

// verify refresh token
async function verifyRefreshToken(refresh) {
  const { refreshToken, userid } =
    (await DBMethods.getRefreshToken(refresh)) || {}
  const user = await DBMethods.getUser(userid)
  if (user.refreshToken === refreshToken) {
    return userid
  }
  return ''
}

// delete refresh token
async function deleteRefreshTokenForUser(userid) {
  const user = await DBMethods.getUser(userid)
  await DBMethods.updateUserRefreshToken(userid, 'empty')
  await DBMethods.deleteRefreshToken(user.refreshToken)
}

module.exports = {
  createRefreshToken,
  deleteRefreshTokenForUser,
  verifyRefreshToken,
  createSessionToken,
  verifySessionToken,
}
