const { DBMethods } = require('../modules/db')
const { S3 } = require('../modules/s3')
const { sanitize } = require('../utils')

const contentDisposition = filename => {
  if (typeof filename !== 'string') {
    // do not have browser open this file
    return `attachment; filename="unknown"`
  }
  let basename = filename.slice(0, ((filename.lastIndexOf('.') - 1) >>> 0) + 1)
  /**
   * if filename contains non-ascii characters, add a utf-8 version
   * for browsers to understand it and encode non-ascii characters
   * newer browsers will take UTF-8 version and show internationalized file name
   * older browsers will not use UTF-8 version
   * see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
   * and express res.download() function
   */
  return /[^\040-\176]/.test(basename)
    ? `inline; filename="${encodeURI(filename)}"; filename*=UTF-8''${encodeURI(
        filename
      )}`
    : `inline; filename="${filename}"`
}

const downloadFileHandler = async (req, res) => {
  const user = (await DBMethods.getUser(req.userid)) || {}
  let { q: docid } = req.query
  docid = sanitize(docid, 'id')

  if (!user.role) {
    return res.status(403).send({
      error: 'Not authorized',
    })
  }

  if (!docid) {
    return res.status(400).send({ error: 'Invalid Request' })
  }
  const doc = (await DBMethods.getDocument(docid)) || {}

  if (doc.docid !== docid) {
    return res.status(404).send({ error: 'Document does not exist' })
  }

  res.setHeader('Content-Type', doc.mimeType)
  res.setHeader('Content-Disposition', contentDisposition(doc.docName))

  S3.getObject({
    Bucket: process.env.BUCKET_NAME,
    Key: docid,
  })
    .createReadStream()
    .on('error', e => {
      console.error(e)
      return res
        .status(501)
        .end(JSON.stringify({ error: 'Error sending file' }))
    })
    .pipe(res)
    .on('error', e => {
      console.error(e)
      return res
        .status(501)
        .end(JSON.stringify({ error: 'Error sending file' }))
    })
    .on('end', res.end)
}

module.exports = downloadFileHandler
