const {
  verifyPassword,
  createRefreshToken,
  createSessionToken,
} = require('../modules/auth')
const { DBMethods } = require('../modules/db')
const axios = require('axios')
const qs = require('querystring')

const { REFRESH_TOKEN_EXPIRY_TIMEOUT } = require('../constants/timers')
const ROUTES = require('../constants/routes')

const { sanitize } = require('../utils')

const loginHandler = async (req, res) => {
  let { body: { username = '', password = '', captcha = '' } = {} } = req

  username = sanitize(username)
  password = sanitize(password)

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
    const { data } = await axios.post(
      process.env.CAPTCHA_ENDPOINT,
      qs.stringify({
        response: captcha,
        secret: process.env.CAPTCHA_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    if (!data.success && process.env.NODE_ENV !== 'development') {
      return respondWith401('Captcha validation failed')
    }
    const user = (await DBMethods.getUser(username)) || {}
    const isPasswordValid = await verifyPassword(user.password, password)
    if (!isPasswordValid) {
      return respondWith401('Invalid username or password')
    }
    const sessionToken = await createSessionToken(username)
    const refreshToken = await createRefreshToken(username)

    res.body = {
      token: sessionToken,
      role: user.role,
    }

    return res
      .status(200)
      .cookie('token', refreshToken, {
        maxAge: REFRESH_TOKEN_EXPIRY_TIMEOUT,
        path: ROUTES.REFRESH_TOKEN,
        httpOnly: true,
        sameSite: 'None',
        ...(process.env.NODE_ENV === 'development'
          ? {
              secure: false,
            }
          : {
              secure: true,
              domain: process.env.MY_DOMAIN,
            }),
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
