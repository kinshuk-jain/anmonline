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

async function updateRecordInUserTable(userid, record) {
  let updateExpression = ''
  let expressionAttributeValues = {}
  Object.keys(record).forEach(k => {
    updateExpression = `${updateExpression}${k} = :${k}, `
    expressionAttributeValues[`:${k}`] = record[k]
  })

  updateExpression = updateExpression.substring(0, updateExpression.length - 2)

  return await docClient
    .update({
      TableName: TableNames.USER,
      Key: {
        userid,
      },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeValues: expressionAttributeValues,
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

// document table methods
async function getDocument(docid) {
  const doc = await docClient
    .get({
      TableName: TableNames.DOCUMENTS,
      Key: {
        docid,
      },
    })
    .promise()

  if (!doc.Item) return undefined

  return doc.Item
}

async function updateRecordInDocTable(docid, record) {
  let updateExpression = ''
  let expressionAttributeValues = {}
  Object.keys(record).forEach(k => {
    updateExpression = `${updateExpression}${k} = :${k}, `
    expressionAttributeValues[`:${k}`] = record[k]
  })

  updateExpression = updateExpression.substring(0, updateExpression.length - 2)

  return await docClient
    .update({
      TableName: TableNames.DOCUMENTS,
      Key: {
        docid,
      },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    })
    .promise()
}

async function deleteRecordFromDocTable(docid) {
  return await docClient
    .delete({
      TableName: TableNames.DOCUMENTS,
      Key: {
        docid,
      },
    })
    .promise()
}

// NOTE: inefficient scan operation
async function getNamesFromTable(prefix) {
  const result = await docClient
    .scan({
      TableName: TableNames.USER,
      ExpressionAttributeNames: {
        '#name': 'name',
        '#role': 'role',
      },
      FilterExpression: 'begins_with(#name, :prefix) AND #role <> :admin',
      ExpressionAttributeValues: {
        ':prefix': prefix,
        ':admin': 'admin',
      },
      PageSize: '10',
    })
    .promise()
  const list = result.Items
  return list.map(v => ({ name: v.name, username: v.userid }))
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

module.exports = {
  getUser,
  addRecordInTable,
  getRefreshToken,
  deleteRefreshToken,
  updateUserPassword,
  updateUserRefreshToken,
  getNamesFromTable,
  updateRecordInDocTable,
  updateRecordInUserTable,
  deleteRecordFromDocTable,
  getDocument,
}
