const TableNames = {
  USER: 'User',
  DOCUMENTS: 'Documents',
  ACCESS_CONTROL: 'AccessControl',
  REFRESH_TOKEN: 'RefreshToken',
}

/**
 * user table schema
    - role -> user(cannot upload), owner(can upload), admin(can do anything)
    - name
    - userid
    - password
    - refreshToken
    - email
    - docsUploaded
    - docsAccessedTimes
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
 * access control table schema
    - userid
    - read access to docids (hash table)
    - write access to docids (hash table)
 */
const accessControlTableParams = {
  TableName: TableNames.ACCESS_CONTROL /* required */,
  AttributeDefinitions: [
    /* required */
    { AttributeName: 'docid', AttributeType: 'S' },
    { AttributeName: 'userid', AttributeType: 'S' },
  ],
  // partition key, required
  KeySchema: [
    { AttributeName: 'userid', KeyType: 'HASH' },
    { AttributeName: 'docid', KeyType: 'RANGE' },
  ],
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
    - type
    - size
    - format
    - docid
    - created for (userid and name)
    - uploaded by (userid and name)
    - date created
    - last accessed on (means time)
    - last accessed by (userid)
    - times accessed
    - s3 reference
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
  accessTable: {
    name: TableNames.ACCESS_CONTROL,
    params: accessControlTableParams,
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
