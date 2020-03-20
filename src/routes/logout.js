const { deleteRefreshTokenForUser } = require('../modules/auth')
const dbmethods = require('../modules/db/db-methods')

const logoutHandler = async (req, res) => {
  const user = (await dbmethods.getUser(req.userid)) || {}
  // TODO: delete all files in user.uploadPendingList from s3
  await deleteRefreshTokenForUser(req.userid)
  res.clearCookie('token')
  return res.status(200).send({ message: 'success' })
}

module.exports = logoutHandler
