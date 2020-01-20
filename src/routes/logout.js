const { deleteRefreshTokenForUser } = require('../modules/auth')

const logoutHandler = async (req, res) => {
  await deleteRefreshTokenForUser(req.userid)
  res.clearCookie('token')
  return res.status(200).send({ message: 'success' })
}

module.exports = logoutHandler
