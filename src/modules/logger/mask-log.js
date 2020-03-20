const MASK_STRING = '*******'

function maskUserPassword(body) {
  return body.password
    ? {
        ...body,
        password: MASK_STRING,
      }
    : body
}

function maskUserDataFromRequestBody(body) {
  const fns = [maskUserPassword]

  return fns.reduce((changedBody, fn) => fn(changedBody), body)
}

module.exports = {
  maskUserDataFromRequestBody,
}
