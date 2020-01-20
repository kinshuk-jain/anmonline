const {
  verifyPassword,
  createRefreshToken,
  createSessionToken,
} = require('../modules/auth')
const axios = require('axios')

const { REFRESH_TOKEN_EXPIRY_TIMEOUT } = require('../constants/timers')
const ROUTES = require('../constants/routes')

const { sanitize } = require('../utils')

const loginHandler = async (req, res) => {
  let { body: { username = '', password = '', captcha = '' } = {} } = req

  username = sanitize(username)
  password = sanitize(password)
  captcha = sanitize(captcha)

  const respondWith401 = msg => {
    res.body = {
      error: msg,
    }
    return res.status(401).send(res.body)
  }

  try {
    if (
      !username ||
      !password ||
      typeof username !== 'string' ||
      typeof password !== 'string'
    ) {
      return respondWith401('Invalid username or password')
    }

    // validate captcha
    const { data } = await axios.post(process.env.CAPTCHA_ENDPOINT, {
      response: captcha,
      secret: process.env.CAPTCHA_SECRET
    })

    if (!data.success && process.env.NODE_ENV !== 'development') {
      return respondWith401('Captcha validation failed')
    }

    const isPasswordValid = await verifyPassword(username, password)
    if (!isPasswordValid) {
      return respondWith401('Invalid username or password')
    }
    const sessionToken = await createSessionToken(username)
    const refreshToken = await createRefreshToken(username)

    res.body = {
      token: sessionToken,
    }

    return res
      .status(200)
      .cookie('token', refreshToken, {
        maxAge: REFRESH_TOKEN_EXPIRY_TIMEOUT,
        path: ROUTES.REFRESH_TOKEN,
        secure: true,
        httpOnly: true,
        domain: process.env.MY_DOMAIN,
        sameSite: 'None',
      })
      .send(res.body)
  } catch (err) {
    console.error({
      type: 'error logging in user',
      message: err.message,
      stack: err.stack,
    })
    return respondWith401('Could not log user in')
  }
}

module.exports = loginHandler
