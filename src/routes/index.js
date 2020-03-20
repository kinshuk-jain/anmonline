const router = require('express').Router()

// routes
const ROUTES = require('../constants/routes')

// middlewares
const {
  validateXRequestedWith,
  validateAuthToken,
  bodyValidator,
} = require('../middlewares')

// handlers
const serviceMetadataHandler = require('./service-metadata')
const loginHandler = require('./login')
const refreshTokenHandler = require('./refresh-token')
const logoutHandler = require('./logout')
const createUserHandler = require('./create-user')
const getNamesHandler = require('./get-names')
const loadUserHandler = require('./load-user')
const uploadFileHandler = require('./upload-file')
const uploadFileFormHandler = require('./upload-file-form')

// routes that do not require an access token or csrf protection
router.get(ROUTES.SERVICE_METADATA, serviceMetadataHandler)
router.post(ROUTES.LOGIN, loginHandler)

// routes that require csrf protection
router.post(ROUTES.REFRESH_TOKEN, validateXRequestedWith, refreshTokenHandler)

// routes that require access token and csrf protection
router.post(
  ROUTES.LOGOUT,
  validateXRequestedWith,
  validateAuthToken,
  logoutHandler
)

router.post(
  ROUTES.GET_NAMES,
  validateXRequestedWith,
  validateAuthToken,
  bodyValidator,
  getNamesHandler
)

router.post(
  ROUTES.UPLOAD_FILE,
  validateXRequestedWith,
  validateAuthToken,
  uploadFileHandler
)

router.post(
  ROUTES.UPLOAD_FILE_FORM,
  validateXRequestedWith,
  validateAuthToken,
  uploadFileFormHandler
)

router.post(
  ROUTES.LOAD_USER,
  validateXRequestedWith,
  validateAuthToken,
  bodyValidator,
  loadUserHandler
)

router.post(
  ROUTES.CREATE_USER,
  validateXRequestedWith,
  validateAuthToken,
  bodyValidator,
  createUserHandler
)

module.exports = router
