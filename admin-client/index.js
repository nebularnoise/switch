const get = require('axios').get
const jwt = require('jsonwebtoken')
const readFileSync = require('fs').readFileSync

const clientName = 'switch'
const cert = readFileSync('./jwtRS256.key')

const token = jwt.sign(
  {
    name: 'switch',
    admin: true
  },
  cert,
  { algorithm: 'RS256' }
)

function open() {
  console.log('OPENING')
  get(`http://localhost:8000/api/open`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`
    }
  })
}

function close() {
  console.log('CLOSING')
  get(`http://localhost:8000/api/close`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`
    }
  })
}

module.exports.open = open
module.exports.close = close
