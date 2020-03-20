const { DBMethods, TableNames } = require('../modules/db')
const { sanitize } = require('../utils')
const { USER_ROLES } = require('../constants/general')

const getNamesHandler = async (req, res) => {
  const adminUser = (await DBMethods.getUser(req.userid)) || {}
  const role = adminUser.role

  if (role !== USER_ROLES.ADMIN) {
    res.body = {
      error: 'Not authorized',
    }
    return res.status(403).send(res.body)
  }

  let { prefix } = req.body

  prefix = sanitize(prefix)
  const nameList = (await DBMethods.getNamesFromTable(prefix)) || []

  res.body = {
    suggestions: nameList,
  }
  return res.status(200).send(res.body)
}

module.exports = getNamesHandler
