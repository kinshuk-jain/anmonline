const cache = {}

module.exports = {
  put: (key, value) => { cache[key] = value },
  get: (key) => cache[key],
  appendAtKey: (key, value) => {
    if(!cache[key]) {
      cache[key] = []
    }
    return typeof cache[key] === 'object' && cache[key].push && cache[key].push(value)
  }
}
