const serviceMetadataHandler = (req, res) => {
  return res.status(200).send({ status: 'ok' })
}

module.exports = serviceMetadataHandler
