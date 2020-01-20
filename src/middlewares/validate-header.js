function validateXRequestedWith(req, res, next) {
  const value = req.get('x-requested-with') || ''
  if (value.trim() !== 'XMLHttpRequest') {
    res.body = {
      error: 'Forbidden',
    }
    return res.status(403).send(res.body)
  }
  next()
}

module.exports = {
  validateXRequestedWith,
}
