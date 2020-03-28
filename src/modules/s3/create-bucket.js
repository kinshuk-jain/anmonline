const { exec } = require('child_process')
const { S3 } = require('./index')

function createBucket() {
  console.log('Creating bucket...')
  exec('export AWS_ACCESS_KEY_ID=kid')
  exec('export AWS_SECRET_ACCESS_KEY=secret')
  exec(
    `aws --endpoint-url=${process.env.AWS_S3_ENDPOINT} s3 mb s3://${process.env.BUCKET_NAME}`,
    err => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      console.log('Bucket created: ' + process.env.BUCKET_NAME)
      process.exit(0)
    }
  )
}

createBucket()
