module.exports = {
  ...require('./validate-jwt'),
  ...require('./validate-header'),
  ...require('./body-validator')
}
