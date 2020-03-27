const ENC_ALGORITHM = 'AES256'
const S3_TAG = 'service=Kinarva'
const AWS = require('aws-sdk')

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_S3_ENDPOINT,
})

const S3 = new AWS.S3({ apiVersion: '2006-03-01' })

function s3Upload(docid, data, Metadata) {
  return S3.upload({
    Bucket: process.env.BUCKET_NAME,
    Tagging: S3_TAG,
    ContentLength: Metadata.size,
    Body: data,
    Key: `${docid}`, // improving key names makes retrieval harder, for now going with this only
    ServerSideEncryption: ENC_ALGORITHM,
    Metadata,
  })
}

function s3Delete(key) {
  return S3.deleteObject({
    Bucket: process.env.BUCKET_NAME,
    Key: key
  })
}

module.exports = {
  S3,
  s3Upload,
  s3Delete
}

// s3.uploadPart
// s3.abortMultipartUpload
// s3.deleteObject
// s3.completeMultipartUpload
