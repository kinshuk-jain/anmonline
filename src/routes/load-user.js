const { DBMethods } = require('../modules/db')
const { sanitize } = require('../utils')
const { USER_ROLES, PAGINATION_LIMIT } = require('../constants/general')

// NOTE: For now one admin can fetch/delete data of other admins

// TODO: add support for filters, change admin username
const loadUserHandler = async (req, res) => {
  const { role, userid, docsList = [] } =
    (await DBMethods.getUser(req.userid)) || {}
  let { username } = req.body
  let { q: start } = req.query
  start = Math.abs(+sanitize(start))
  // NOTE: assumes there are not more than 10000 docs for a user
  start = start !== start || start > 10000 ? 0 : start

  username = sanitize(username)

  const getAllDocs = async list => {
    let results = []

    for (let docid of list) {
      const doc = await DBMethods.getDocument(docid)
      if (!doc || !doc.uploadedBy) continue
      doc.createdBy = doc.uploadedBy.name
      delete doc['createdFor']
      delete doc['mimeType']
      delete doc['s3Reference']
      delete doc['timesAccessed']
      // if user is admin or is user who uploaded it, allow deletion of doc
      if (userid === doc.uploadedBy.userid || role === USER_ROLES.ADMIN) {
        doc.deleteAllowed = true
      }
      delete doc['uploadedBy']
      results.push(doc)
    }
    return results
  }

  if (!username || userid === username) {
    const results = await getAllDocs(
      docsList.slice(start, start + PAGINATION_LIMIT)
    )
    return res.status(200).send({
      results,
      role,
      ...(role === USER_ROLES.OWNER
        ? { prefillUser: { name: 'anm and associates', username: 'anm' } }
        : null),
    })
  }

  if (role === USER_ROLES.ADMIN) {
    const user = (await DBMethods.getUser(username)) || {}
    const results = await getAllDocs(
      (user.docsList || []).slice(start, start + PAGINATION_LIMIT)
    )
    return res.status(200).send({ results, role })
  }

  return res.status(403).send({ error: 'Not Authorized' })
}

module.exports = loadUserHandler
