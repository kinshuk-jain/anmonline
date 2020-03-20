const ROUTES = require('../constants/routes')

module.exports = {
  [ROUTES.CREATE_USER]: require('./create-user/request'),
  [ROUTES.LOGIN]: require('./login/request'),
  [ROUTES.GET_NAMES]: require('./get-names/request'),
  [ROUTES.LOAD_USER]: require('./load-user/request'),
  [ROUTES.UPLOAD_FILE_FORM]: require('./upload-doc/request')
}
