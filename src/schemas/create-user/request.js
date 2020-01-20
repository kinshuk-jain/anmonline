module.exports = {
  "$id": "http://example.com/schemas/schema.json",
  "type": "object",
  "required": ["name", "userid", "email", "canUpload"],
  "properties": {
    "name": { "type": "string" },
    "userid": { "type": "string" },
    "email": { "type": "string" },
    "canUpload": { "type": "boolean" }
  }
}
