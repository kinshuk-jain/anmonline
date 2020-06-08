// 60 sec (expressed in ms)
const REQUEST_TIMEOUT = 60 * 1000

// 15 min (expressed in s)
const JWT_EXPIRY_TIMEOUT = 15 * 60

// 30 days (expressed in ms)
const REFRESH_TOKEN_EXPIRY_TIMEOUT = 30 * 24 * 60 * 60 * 1000

module.exports = {
  REFRESH_TOKEN_EXPIRY_TIMEOUT,
  JWT_EXPIRY_TIMEOUT,
  REQUEST_TIMEOUT,
}
