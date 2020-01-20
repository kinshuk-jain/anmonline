const { docClient } = require('./connect')
const { TableNames } = require('./db-config')

// User table methods
async function getUser(userid) {
  const userDoc = await docClient
    .get({
      TableName: TableNames.USER,
      Key: {
        userid,
      },
    })
    .promise()

  if (!userDoc.Item) return false

  return userDoc.Item
}

async function updateUserPassword(userid, password) {
  return await docClient
    .update({
      TableName: TableNames.USER,
      Key: {
        userid,
      },
      UpdateExpression: 'SET password = :password',
      ExpressionAttributeValues: {
        ':password': password,
      },
      ReturnValues: 'ALL_NEW',
    })
    .promise()
}

async function updateUserRefreshToken(userid, token) {
  return await docClient
    .update({
      TableName: TableNames.USER,
      Key: {
        userid,
      },
      UpdateExpression: 'SET refreshToken = :token',
      ExpressionAttributeValues: {
        ':token': token,
      },
      ReturnValues: 'ALL_NEW',
    })
    .promise()
}

// refresh token table methods
async function getRefreshToken(refreshToken) {
  const refreshTokenDoc = await docClient
    .get({
      TableName: TableNames.REFRESH_TOKEN,
      Key: {
        refreshToken,
      },
    })
    .promise()

  if (!refreshTokenDoc.Item) return false

  return refreshTokenDoc.Item
}

async function deleteRefreshToken(refreshToken) {
  return docClient
    .delete({
      TableName: TableNames.REFRESH_TOKEN,
      Key: {
        refreshToken,
      },
    })
    .promise()
}

// generic methods
async function addRecordInTable(tableName, record) {
  await docClient
    .put({
      TableName: tableName,
      Item: record,
      ReturnConsumedCapacity: 'TOTAL',
    })
    .promise()
}

// return await docClient
// .update({
//   TableName: TableNames.AUTHORIZATION_CODE,
//   Key: {
//     code: hashedAuthCode
//   },
//   ConditionExpression: 'code = :code',
//   UpdateExpression: 'SET revoked = :revoked',
//   ExpressionAttributeValues: {
//     ':code': hashedAuthCode,
//     ':revoked': true
//   },
//   ReturnValues: 'ALL_NEW'
// })
// .promise()

module.exports = {
  getUser,
  addRecordInTable,
  getRefreshToken,
  deleteRefreshToken,
  updateUserPassword,
  updateUserRefreshToken,
}
