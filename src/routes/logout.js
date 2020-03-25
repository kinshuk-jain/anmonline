const { deleteRefreshTokenForUser } = require('../modules/auth')
const dbmethods = require('../modules/db/db-methods')

const logoutHandler = async (req, res) => {
  const { uploadPendingList, userid } =
    (await dbmethods.getUser(req.userid)) || {}

  uploadPendingList.forEach(async docid => {
    // TODO: delete from s3
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
