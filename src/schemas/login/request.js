module.exports = {
  "$id": "http://example.com/schemas/schema.json",
  "type": "object",
  "required": ["username", "password", "captcha"],
  "properties": {
    "username": { "type": "string" },
    "password": { "type": "string" },
    "captcha": { "type": "string" },
  }
}
