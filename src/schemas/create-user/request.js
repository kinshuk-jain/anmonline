module.exports = {
  "$id": "create-user",
  "type": "object",
  "required": ["name", "userid", "email", "canUpload"],
  "properties": {
    "name": { "type": "string" },
    "userid": { "type": "string" },
    "email": { "type": "string" },
    "canUpload": { "type": "boolean" }
  }
}
