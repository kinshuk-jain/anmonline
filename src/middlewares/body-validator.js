const Ajv = require('ajv')
const ajv = new Ajv()
const schemas = require('../schemas')

function bodyValidator(req, res, next) {
  var valid = ajv.validate(schemas[req.path], req.body)
  if (!valid) {
    const err = ajv.errors[0]
    return next({
      message: err.message,
      stack: err.params,
    })
  }
  return next()
}

module.exports = {
  bodyValidator,
}
