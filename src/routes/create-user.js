const sgMail = require('@sendgrid/mail')

const { DBMethods, TableNames } = require('../modules/db')
const { generatePassword } = require('../modules/auth')
const { sanitize } = require('../utils')
const { NO_REPLY_EMAIL, USER_ROLES } = require('../constants/general')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
      role: userRole,
      password: hash,
      email,
      userid,
      refreshToken: 'empty',
      docsList: [],
      docsAccessedTimes: {},
    })

    const emailOptions = {
      to: [email, adminUser.email],
      from: NO_REPLY_EMAIL,
      templateId: process.env.EMAIL_TEMPLATE_ID,
      dynamic_template_data: {
        username: userid,
        password,
      },
    }

    sgMail.send(emailOptions)
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
