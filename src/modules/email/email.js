const AWS_SES = require('aws-sdk/clients/ses')

const SES = new AWS_SES({
  apiVersion: '2010-12-01',
  ...(process.env.NODE_ENV !== 'production'
    ? {
        accessKeyId: 'akid',
        secretAccessKey: 'secret',
      }
    : {}),
})

function sendEmail({
  from = 'no-reply@kinarva.com',
  to = [],
  subject = '',
  bodyHtml = '',
  bodyText = '',
}) {
  const charset = 'UTF-8'
  const params = {
    Source: from,
    Destination: {
      ToAddresses: to,
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: charset,
      },
      Body: {
        Text: {
          Data: bodyText,
          Charset: charset,
        },
        Html: {
          Data: bodyHtml,
          Charset: charset,
        },
      },
    },
    // ConfigurationSetName: configuration_set
  }

  SES.sendEmail(params, function(err, data) {
    if (err) {
      console.error(err)
    } else {
      console.log('Email sent! Message ID: ', data.MessageId)
    }
  })
}

function sendLoginCredsEmail(
  recipient = ['kinshuk2jain@gmail.com'],
  username,
  password
) {
  if (!Array.isArray(recipient)) {
    throw 'recipient must be an array of recipients'
  }
  if (!username || !password) {
    throw 'input missing: username or password'
  }
  const subject = 'Your login for kinarva.com'
  const sender = 'Kinarva Login <no-reply@kinarva.com>'

  // The email body for recipients with non-HTML email clients.
  const body_text = `Your account has been created on Kinarva.com. Please use the following username and password to login:\r\n
      Username:${username}\r\n
      Password:${password}\r\n
    Please keep your username and password safe. These will be used in future to login to kinarva.com(https://kinarva.com) and use it's features.\r\n\r\n
    Please do not reply back to this email as we are unable to respond.
  `

  // The HTML body of the email.
  const body_html = `<html>
    <head></head>
    <body>
        <div class="webkit">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
            <tbody><tr>
              <td valign="top" bgcolor="#FFFFFF" width="100%">
                <table width="100%" role="content-container" class="outer" align="left" cellpadding="0" cellspacing="0" border="0">
                  <tbody><tr>
                    <td width="100%">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tbody><tr>
                          <td>
                            <!--[if mso]>
    <center>
    <table><tr><td width="600">
  <![endif]-->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="left">
                                      <tbody><tr>
                                        <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
</table><table class="module" role="module" data-type="code" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="b89d0984-c641-4a42-8c3a-419d887ec7cd">
    <tbody>
      <tr>
        <td height="100%" valign="top" role="module-content"><p>Your account has been created on Kinarva.com. Please use the following username and password to login:</p>
</td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="6a4443b4-82d6-400f-a341-ca611dac3200">
    <tbody>
      <tr>
        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="code" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f8142fbb-c9ed-452a-a489-1d57cf3e3c11">
    <tbody>
      <tr>
        <td height="100%" valign="top" role="module-content"><div style="background:#efefef;padding:10px 10px;">
<pre>Username: ${username}</pre>
<pre>Password: ${password}</pre>
</div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="bb7eae60-0ed8-42dd-9045-e73fb0ab9c78">
    <tbody>
      <tr>
        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="code" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="57bcd1ba-810c-4a4d-943c-787a2fa0cfa6">
    <tbody>
      <tr>
        <td height="100%" valign="top" role="module-content"><p>Please keep your username and password safe. These will be used in future to login to <a href="https://kinarva.com" target="_blank" rel="noopener noreferrer">kinarva.com</a> and use it's features.</p></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="e44e7fb9-0f73-4e1d-9e38-5724286722a1">
    <tbody>
      <tr>
        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
    </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="9496c1ca-310b-439a-ae5f-5658b82bfe95">
      <tbody>
        <tr>
          <td align="left" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;">
            <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
              <tbody>
                <tr>
                <td align="center" bgcolor="#3282b8" class="inner-td" style="border-radius:6px; font-size:16px; text-align:left; background-color:inherit;">
                  <a href="https://kinarva.com" style="background-color:#3282b8; border:0px solid #333333; border-color:#333333; border-radius:6px; border-width:0px; color:#ffffff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;" target="_blank">Take me to Login</a>
                </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="7dc29d9d-2d52-490c-86c3-452a6e59821e">
    <tbody>
      <tr>
        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="368c5011-bc5f-4cfd-925a-bd06f2e5c811" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:10px 0px 10px 0px; line-height:20px; text-align:inherit; background-color:#EFE;" height="100%" valign="top" bgcolor="#EFE" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-size: 14px; font-family: helvetica, sans-serif">Please do not reply back to this email as we are unable to respond</span></div>
<div style="font-family: inherit; text-align: inherit; margin-left: 0px"><br>
</div><div></div></div></td>
      </tr>
    </tbody>
  </table></td>
                                      </tr>
                                    </tbody></table>
                                    <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                          </td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
          </tbody></table>
        </div>
    </body>
    </html>`

  sendEmail({
    from: sender,
    to: recipient,
    subject,
    bodyHtml: body_html,
    bodyText: body_text,
  })
}

module.exports = {
  sendLoginCredsEmail,
}
