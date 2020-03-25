const TableNames = {
  USER: 'User',
  DOCUMENTS: 'Documents',
  REFRESH_TOKEN: 'RefreshToken',
}
// due to dynamodb limits each item size cannot be more than 400kb
/**
 * user table schema
    - role -> user(cannot upload), owner(can upload), admin(can do anything)
    - name
    - userid
    - password
    - refreshToken
    - email
    - docsList: can contain duplicate values
    - numOfDocsUploaded
    - docsAccessedTimes
    - uploadPendingList
  */
const userTableParams = {
  TableName: TableNames.USER /* required */,
  AttributeDefinitions: [
    /* required */
    { AttributeName: 'userid', AttributeType: 'S' },
  ],
  KeySchema: [{ AttributeName: 'userid', KeyType: 'HASH' }], // partition key, required
  ProvisionedThroughput: {
    /* required */
    // number of strongly consistent reads per second or double eventually consistent reads
    ReadCapacityUnits: 10,
    // data in KBs to be written per second. Setting it to 10KB
    WriteCapacityUnits: 10,
  },
}

/**
 * Refresh token table schema
   - refreshToken
   - userid
 */
const refreshTokenTableParams = {
  TableName: TableNames.REFRESH_TOKEN /* required */,
  AttributeDefinitions: [
    /* required */
    { AttributeName: 'refreshToken', AttributeType: 'S' },
  ],
  KeySchema: [{ AttributeName: 'refreshToken', KeyType: 'HASH' }], // partition key, required
  ProvisionedThroughput: {
    /* required */
    // number of strongly consistent reads per second or double eventually consistent reads
    ReadCapacityUnits: 10,
    // data in KBs to be written per second. Setting it to 10KB
    WriteCapacityUnits: 10,
  },
}

/**
 * documents table schema
    - docType
    - size
    - mimeType
    - docid
    - docName
    - createdFor (userid and name)
    - uploadedBy (userid and name)
    - dateCreated
    - lastAccessedOn (means time)
    - lastAccessedBy (userid)
    - timesAccessed
    - s3Reference
    - metadata
 */
const documentsTableParams = {
  TableName: TableNames.DOCUMENTS /* required */,
  AttributeDefinitions: [
    /* required */
    { AttributeName: 'docid', AttributeType: 'S' },
  ],
  KeySchema: [{ AttributeName: 'docid', KeyType: 'HASH' }], // partition key, required
  ProvisionedThroughput: {
    /* required */
    // number of strongly consistent reads per second or double eventually consistent reads
    ReadCapacityUnits: 10,
    // data in KBs to be written per second. Setting it to 10KB
    WriteCapacityUnits: 10,
  },
}

const DBConfig = {
  user: {
    name: TableNames.USER,
    params: userTableParams,
  },
  documents: {
    name: TableNames.DOCUMENTS,
    params: documentsTableParams,
  },
  refreshToken: {
    name: TableNames.REFRESH_TOKEN,
    params: refreshTokenTableParams,
  },
}

module.exports = {
  DBConfig,
  TableNames,
}
