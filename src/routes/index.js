const router = require('express').Router()

// routes
const ROUTES = require('../constants/routes')

// middlewares
const { validateXRequestedWith, validateAuthToken, bodyValidator } = require('../middlewares')

// handlers
const serviceMetadataHandler = require('./service-metadata')
const loginHandler = require('./login')
const refreshTokenHandler = require('./refresh-token')
const logoutHandler = require('./logout')
const createUserHandler = require('./create-user')

// routes that do not require an access token or csrf protection
router.get(ROUTES.SERVICE_METADATA, serviceMetadataHandler)
router.post(ROUTES.LOGIN, loginHandler)

// routes that require csrf protection
router.post(ROUTES.REFRESH_TOKEN, validateXRequestedWith, refreshTokenHandler)

// routes that require access token and csrf protection
router.post(
  ROUTES.LOGOUT,
  validateAuthToken,
  validateXRequestedWith,
  logoutHandler
)

router.post(
  ROUTES.CREATE_USER,
  validateAuthToken,
  validateXRequestedWith,
  bodyValidator,
  createUserHandler
)

module.exports = router
