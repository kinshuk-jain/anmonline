const bcrypt = require('bcrypt')
const generator = require('generate-password')
const promisify = require('util').promisify
const { DBMethods } = require('../db')

// generates 40 hashes per sec on 2GHz processor
// 10 is desired value that generates 10 hashes/s on 2 GHz processor
const SALT_ROUNDS = 8

function updatePassword(userid, password) {
  return bcrypt
    .hash(password, SALT_ROUNDS)
    .then(async hash => {
      await DBMethods.updateUserPassword(userid, hash)
      return true
    })
    .catch(err => {
      console.error({
        type: 'error updating password',
        message: err.message,
        stack: err.stack,
      })
    })
}

async function verifyPassword(storedPassword, userEnteredPassword) {
  return bcrypt
    .compare(userEnteredPassword, storedPassword)
    .then(result => result)
    .catch(err => {
      console.error({
        type: 'error hashing password',
        message: err.message,
        stack: err.stack,
      })
    })
}

// temporary till forgot password is implemented
function generatePassword() {
  const password = generator.generate({
    length: 10,
    numbers: true,
    uppercase: true,
    excludeSimilarCharacters: true,
    symbols: false,
  })

  return bcrypt
    .hash(password, SALT_ROUNDS)
    .then(hash => ({ hash, password }))
    .catch(err => {
      console.error({
        type: 'error hashing password',
        message: err.message,
        stack: err.stack,
      })
    })
}

module.exports = {
  verifyPassword,
  updatePassword,
  generatePassword,
}
