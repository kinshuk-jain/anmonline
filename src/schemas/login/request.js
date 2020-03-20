module.exports = {
  $id: 'login',
  type: 'object',
  required: ['username', 'password', 'captcha'],
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
    captcha: { type: 'string' },
  },
}
