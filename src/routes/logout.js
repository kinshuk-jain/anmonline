const { deleteRefreshTokenForUser } = require('../modules/auth')
const dbmethods = require('../modules/db/db-methods')
const { s3Delete } = require('../modules/s3')

const logoutHandler = async (req, res) => {
  const { uploadPendingList, userid } =
    (await dbmethods.getUser(req.userid)) || {}

  uploadPendingList.forEach(async docid => {
    await s3Delete(docid)
    await dbmethods.deleteRecordFromDocTable(docid)
  })

  await dbmethods.updateRecordInUserTable(userid, {
    uploadPendingList: [],
  })

  await deleteRefreshTokenForUser(req.userid)
  res.clearCookie('token')
  return res.status(200).send({ message: 'success' })
}

module.exports = logoutHandler
