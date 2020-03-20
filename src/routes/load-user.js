const { DBMethods, TableNames } = require('../modules/db')
const { sanitize } = require('../utils')
const { USER_ROLES } = require('../constants/general')

// TODO: add pagination support
const loadUserHandler = async (req, res) => {
  let { username } = req.body
  if (req.userid !== username) {
    const adminUser = (await DBMethods.getUser(req.userid)) || {}
    const role = adminUser.role
    if (role !== USER_ROLES.ADMIN) {
      res.body = {
        error: 'Not authorized',
      }
      return res.status(403).send(res.body)
    }
  }

  username = sanitize(username)
  // look in access control table and get all docs
  const docsList = (await DBMethods.getAllDocs(username)) || []

  res.body = {
    docs: docsList,
  }
  return res.status(200).send(res.body)
}

module.exports = loadUserHandler
