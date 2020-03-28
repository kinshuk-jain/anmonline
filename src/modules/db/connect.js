const AWS = require('aws-sdk')

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_DB_ENDPOINT,
  ...(process.env.NODE_ENV !== 'production'
    ? {
        accessKeyId: 'akid',
        secretAccessKey: 'secret',
      }
    : {}),
})

const dynamodb = new AWS.DynamoDB({
  sslEnabled: true,
  apiVersion: '2012-08-10',
})

const docClient = new AWS.DynamoDB.DocumentClient({
  service: dynamodb,
})

module.exports = {
  dynamodb,
  docClient,
}
