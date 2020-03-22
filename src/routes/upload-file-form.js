const dbmethods = require('../modules/db/db-methods')
const { USER_ROLES } = require('../constants/general')

const uploadFileFormHandler = async (req, res) => {
  const user = (await dbmethods.getUser(req.userid)) || {}
  if (user.role !== USER_ROLES.ADMIN && user.role !== USER_ROLES.OWNER) {
    return res.status(401).send({ status: 'failed', error: 'Not allowed' })
  }
  const { username, year, docType, numOfFilesUploaded } = req.body

  const uploadedForUser = (await dbmethods.getUser(username)) || {}
  if (uploadedForUser.userid !== username || username === 'admin') {
    return res
      .status(400)
      .send({
        status: 'failed',
        error:
          'Name of user for which the document was uploaded is not correct',
      })
  }
  // do not allow uploading documents for self
  if (uploadedForUser.userid === user.userid) {
    return res
      .status(400)
      .send({ status: 'failed', error: 'Cannot upload document for yourself' })
  }
  // allow non admins only to upload to admin
  if (
    user.role !== USER_ROLES.ADMIN &&
    uploadedForUser.role !== USER_ROLES.ADMIN
  ) {
    return res
      .status(400)
      .send({
        status: 'failed',
        error: 'You cannot upload files for this user',
      })
  }

  const pendingList = user.uploadPendingList || []

  if (!pendingList.length) {
    return res.status(400).send({ status: 'failed', error: 'No file uploaded' })
  }

  pendingList.slice(-numOfFilesUploaded).forEach(async docid => {
    await dbmethods.updateRecordInDocTable(docid, {
      docType,
      createdFor: {
        name: uploadedForUser.name,
        userid: uploadedForUser.userid,
      },
      uploadedBy: { name: user.name, userid: user.userid },
      metadata: {
        year,
      },
    })
  })

  await dbmethods.updateRecordInUserTable(uploadedForUser.userid, {
    docsList: (uploadedForUser.docsList || []).concat(
      pendingList.slice(-numOfFilesUploaded)
    ),
  })
  await dbmethods.updateRecordInUserTable(user.userid, {
    numOfDocsUploaded:
      (user.numOfDocsUploaded ? 0 : +user.numOfDocsUploaded) +
      numOfFilesUploaded +
      '',
    uploadPendingList: [],
  })

  pendingList
    .slice(0, pendingList.length - numOfFilesUploaded)
    .forEach(async docid => {
      // TODO: delete from s3
      await dbmethods.deleteRecordFromDocTable(docid)
    })

  res.status(200).send({ status: 'success' })
}

module.exports = uploadFileFormHandler
