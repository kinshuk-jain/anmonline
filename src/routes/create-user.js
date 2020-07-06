const { DBMethods, TableNames } = require('../modules/db')
const { generatePassword } = require('../modules/auth')
const { sendLoginCredsEmail } = require('../modules/email')
const { sanitize } = require('../utils')
const { NO_REPLY_EMAIL, USER_ROLES } = require('../constants/general')

// Future work: add email address verification before sending emails

// this cannot be used to create admin users. They will be created manually
const createUserHandler = async (req, res) => {
  const adminUser = (await DBMethods.getUser(req.userid)) || {}
  const role = adminUser.role

  if (role !== USER_ROLES.ADMIN) {
    res.body = {
      error: 'Not authorized',
    }
    return res.status(403).send(res.body)
  }

  let { name, userid, email, canUpload } = req.body

  name = sanitize(name, 'name')
  email = sanitize(email, 'email')
  userid = sanitize(userid, 'id')

  const isExistingUser = await DBMethods.getUser(userid)
  if (!isExistingUser) {
    const { hash, password } = await generatePassword()
    const userRole = sanitize(canUpload) === 'true' ? 'owner' : 'user'

    await DBMethods.addRecordInTable(TableNames.USER, {
      name,
      role: 'user', // hardcoding user for now, should be userRole
      password: hash,
      email,
      userid,
      refreshToken: 'empty',
      docsList: [],
      docsAccessedTimes: {},
    })

    // send email with credentials
    // TODO: add adminUser.email once out of sandbox
    sendLoginCredsEmail([email], userid, password)

    res.body = {
      message: 'User successfully created',
    }
    return res.status(200).send(res.body)
  }
  res.body = {
    error: 'User already exists',
  }
  return res.status(400).send(res.body)
}

module.exports = createUserHandler
