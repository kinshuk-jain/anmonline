const { dynamodb, DBConfig, docClient, TableNames } = require('./index')
const { USER_ROLES } = require('../../constants/general')
async function createTables() {
  console.log('Preparing DynamoDB local:')

  // delete tables
  const listTablesResult = await dynamodb.listTables().promise()

  if (listTablesResult && listTablesResult.TableNames) {
    await Promise.all(
      listTablesResult.TableNames.map(async (tableName) => {
        console.log(`* Deleting table ${tableName}`)
        return await dynamodb.deleteTable({ TableName: tableName }).promise()
      })
    )
  }

  // create tables
  for (let property in DBConfig) {
    console.info(`* Creating table ${DBConfig[property].name}`)
    await dynamodb.createTable(DBConfig[property].params).promise()
  }
}

createTables()
  .then(async () => {
    return await docClient
      .put({
        TableName: TableNames.USER,
        Item: {
          userid: '12345',
          name: 'admin',
          role: USER_ROLES.ADMIN,
          password:
            '$2b$08$8DC7I7tEwSY1P55EQP2FOujDWRXxK9bT2lXSnh8B6FYxR5JOKVA2q',
          refreshToken: 'no-empty',
          email: 'admin@example.com',
        },
        ReturnConsumedCapacity: 'TOTAL',
      })
      .promise()
  })
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
