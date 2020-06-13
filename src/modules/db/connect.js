const AWS_DYNAMODB = require('aws-sdk/clients/dynamodb')

const dynamodb = new AWS_DYNAMODB({
  sslEnabled: true,
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION,
  ...(process.env.NODE_ENV !== 'production'
    ? {
        accessKeyId: 'akid',
        secretAccessKey: 'secret',
        endpoint: process.env.AWS_DB_ENDPOINT,
      }
    : {}),
})

const docClient = new AWS_DYNAMODB.DocumentClient({
  service: dynamodb,
})

module.exports = {
  dynamodb,
  docClient,
}
