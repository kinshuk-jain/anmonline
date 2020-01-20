function sanitize(value, type = '') {
  if (typeof value !== 'string') return value
  const s = value.trim().replace(/[`"')({}=~^%#>*$:!?<|\\\/\[\]]+/g, '')
  if (!type) return s

  if (type === 'email') return s.replace(/[,&]+/g, '')
  if (type === 'name') return s.replace(/[@]+/g, '')
  if (type === 'id') return s.replace(/[^a-z0-9]+/gi, '')
}

module.exports = {
  sanitize,
}
