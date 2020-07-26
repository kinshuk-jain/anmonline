const { deleteRefreshTokenForUser } = require('../modules/auth')
const dbmethods = require('../modules/db/db-methods')
const { s3Delete } = require('../modules/s3')
const cache = require('../utils/cache')

const logoutHandler = async (req, res) => {
  const { userid } = req
  const uploadPendingList = cache.get(userid) || []
  uploadPendingList.forEach(async docid => {
    await s3Delete(docid)
    await dbmethods.deleteRecordFromDocTable(docid)
  })

  await deleteRefreshTokenForUser(userid)
  res.clearCookie('token')
  return res.status(200).send({ message: 'success' })
}

module.exports = logoutHandler
