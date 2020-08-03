const ENC_ALGORITHM = 'AES256'
const S3_TAG = 'service=Kinarva'
const AWS_S3 = require('aws-sdk/clients/s3')

const S3 = new AWS_S3({
  apiVersion: '2006-03-01',
  region: process.env.AWS_REGION,
  ...(process.env.NODE_ENV !== 'production'
    ? {
        accessKeyId: 'akid',
        secretAccessKey: 'secret',
        s3ForcePathStyle: true,
        endpoint: process.env.AWS_S3_ENDPOINT,
      }
    : {}),
})

function s3Upload(docid, dataStream, Metadata = {}, callback = () => {}) {
  return S3.upload(
    {
      Bucket: process.env.BUCKET_NAME,
      Tagging: S3_TAG,
      // setting this causes small file uploads to hang sometimes i.e. less than 50KB
      // ContentLength: Metadata.size,
      Body: dataStream,
      Key: `${docid}`, // improving key names makes retrieval harder, for now going with this only
      ServerSideEncryption: ENC_ALGORITHM,
      Metadata,
      StorageClass: 'ONEZONE_IA',
    },
    callback
  )
}

function s3Delete(key) {
  return S3.deleteObject(
    {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    },
    (e) => {
      if (e) console.error('Deleting from S3 failed: ' + key)
    }
  )
}

module.exports = {
  S3,
  s3Upload,
  s3Delete,
}

// s3.uploadPart
// s3.abortMultipartUpload
// s3.deleteObject
// s3.completeMultipartUpload
