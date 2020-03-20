const NO_REPLY_EMAIL = 'no-reply@kinarva.com'

const DISALLOWED_MIME_TYPES = [
  'application/octet-stream',
  'application/x-javascript',
  'application/x-msaccess',
  'application/x-ms-application',
  'application/java-archive',
  'application/postscript',
  'text/vbscript',
  'text/html',
  /video\/.*/,
  /audio\/.*/
]

const USER_ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  USER: 'user'
}

module.exports = {
  NO_REPLY_EMAIL,
  USER_ROLES,
  DISALLOWED_MIME_TYPES
}
