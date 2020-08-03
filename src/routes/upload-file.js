const { v4: uuidv4 } = require('uuid')
const Stream = require('stream')
const dbmethods = require('../modules/db/db-methods')
const cache = require('../utils/cache')
const { TableNames } = require('../modules/db/db-config')
const { USER_ROLES, DISALLOWED_MIME_TYPES } = require('../constants/general')
const { s3Upload } = require('../modules/s3')

// TODO: compress files before uploading to s3
const uploadFileHandler = async (req, res, next) => {
  const user = (await dbmethods.getUser(req.userid)) || {}
  if (user.role !== USER_ROLES.ADMIN && user.role !== USER_ROLES.OWNER) {
    return res.status(403).send({ error: 'Not allowed' })
  }
  let fileSize = req.headers['content-length']

  if (fileSize > 25000000) {
    res
      .status(400)
      .send({ status: 'failure', reason: 'file greater than 25 MB' })
  }

  let start = false
  let EOL = '\n'
  let boundary
  let filename
  let fileType
  let docid = uuidv4()
  let uploadObj
  const rStream = new Stream.Readable()
  rStream._read = () => {} // no-op, but required for readable stream

  // client sending data
  req.on('data', (data) => {
    if (!start) {
      start = true
      // read first line: Multipart boundary
      let index = data.indexOf(EOL)
      if (data.toString('utf8', index - 1, index) === '\r') {
        EOL = '\r\n'
      }
      boundary = data.toString('utf8', 0, index - EOL.length + 1)

      // read second line: Content-disposition header
      index = data.indexOf(EOL, index + 1)
      const contentDisposition =
        data.toString('utf8', boundary.length + 1, index) || ''
      filename = contentDisposition.split('filename="')[1]
      filename = filename ? filename.slice(0, filename.length - 1) : filename

      // read third line: Content-type header
      index = data.indexOf(EOL, index + EOL.length)
      const contentType =
        data.toString(
          'utf8',
          boundary.length + contentDisposition.length + 1,
          index
        ) || ''
      fileType = contentType.split('Content-Type:')[1]
      fileType = fileType ? fileType.trim() : fileType

      // if file type is any of the disallowed mimetypes, return error
      if (DISALLOWED_MIME_TYPES.some((mime) => fileType.search(mime) !== -1)) {
        return res
          .status(403)
          .send({ status: 'failed', error: 'File type not allowed' })
      }

      // read fourth line: Empty space, indicates beginning of data from next line
      index = data.indexOf(EOL, index + EOL.length)

      // remove headers
      data = data.slice(index + EOL.length)

      // start uploading to s3
      const d = new Date()
      uploadObj = s3Upload(
        docid,
        rStream,
        {
          type: fileType,
          size: fileSize,
          date: [d.getFullYear(), `${d.getMonth() + 1}`, `${d.getDate()}`].join(
            '-'
          ),
        },
        (err, data) => {
          if (err) {
            console.error(err)
            return res
              .status(501)
              .send({ status: 'failed', error: 'Failed to upload file' })
          } else {
            dbmethods.addRecordInTable(TableNames.DOCUMENTS, {
              size: fileSize,
              docid,
              docName: filename,
              mimeType: fileType,
              uploadedBy: user.userid,
              dateCreated: Date.now().toString(),
              // s3Reference
            })
            // update uploadPendingList
            cache.appendAtKey(user.userid, docid)
            return res.status(200).send({ status: 'success' })
          }
        }
      )
    }

    let ind = data.indexOf(boundary)
    if (ind === -1) {
      // pipe data
      rStream.push(data)
    } else {
      // pipe data.slice(0, ind - 1)
      rStream.push(data.slice(0, ind - 1))
    }
  })

  // client cancelled request
  req.on('aborted', (e) => {
    // abort piping to s3 and end stream
    uploadObj.abort()
    rStream.push(null)
    return res.status(400).send({ status: 'aborted' })
  })

  // error in request
  req.on('error', (e) => {
    // abort piping to s3 and end stream
    uploadObj.abort()
    rStream.push(null)
    return next(e)
  })

  // client finished sending data
  req.on('end', async (e) => {
    // end the stream
    rStream.push(null)
  })

  res.on('finish', () => {
    // req timed out
    if (res.statusCode === 408) {
      // abort piping to s3 and end stream
      uploadObj.abort()
      rStream.push(null)
    }
  })
}

module.exports = uploadFileHandler
