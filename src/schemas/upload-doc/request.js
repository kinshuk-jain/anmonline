module.exports = {
  $id: 'upload-doc',
  type: 'object',
  required: ['username', 'year', 'docType', 'numOfFilesUploaded', 'subType'],
  properties: {
    username: { type: 'string' },
    year: { type: 'string' },
    docType: {
      type: 'string',
      example: 'audit-report',
    },
    subType: {
      type: 'string',
      example: 'audit-report',
    },
    numOfFilesUploaded: { type: 'number' },
  },
}
