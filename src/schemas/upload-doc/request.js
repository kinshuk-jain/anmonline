module.exports = {
  $id: 'login',
  type: 'object',
  required: ['username', 'year', 'docType', 'numOfFilesUploaded'],
  properties: {
    username: { type: 'string' },
    year: { type: 'string' },
    docType: {
      type: 'string',
      enum: ['audit-report', 'finance-report', 'gullu-report'],
    },
    numOfFilesUploaded: { type: 'number' },
  },
}
