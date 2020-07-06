const dbmethods = require('../modules/db/db-methods')
const { sanitize } = require('../utils')
const { s3Delete } = require('../modules/s3')
const { USER_ROLES } = require('../constants/general')

const deleteFileHandler = async (req, res) => {
  const user = (await DBMethods.getUser(req.userid)) || {}
  const role = user.role

  if (user.role !== USER_ROLES.ADMIN && user.role !== USER_ROLES.OWNER) {
    res.body = {
      error: 'Not authorized',
    }
    return res.status(403).send(res.body)
  }

  let { q: docid } = req.query
  docid = sanitize(docid, 'id')
  const doc = (await DBMethods.getDocument(docid)) || {}

  if (doc.docid !== docid) {
    return res.status(404).send({ error: 'Document does not exist' })
  }

  if (
    role === USER_ROLES.ADMIN ||
    (role === USER_ROLES.OWNER && doc.uploadedBy.userid === user.userid)
  ) {
    await dbmethods.deleteRecordFromDocTable(docid)
    await s3Delete(docid)
    return res.status(200).send({
      status: 'successfully deleted',
    })
  }

  res.body = {
    error: 'Unauthorized action',
  }
  return res.status(403).send(res.body)
}

module.exports = deleteFileHandler
