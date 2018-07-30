import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'express-jwt'
import fs from 'fs'
import morgan from 'morgan'
//import https from 'https'

import { open, isOpen, close } from './routes'

const app = express()

app.use(morgan('common'))
app.use(helmet())
app.use(
  cors({
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)
app.use(compression())

const publicKey = fs.readFileSync('./switch-key.pub')

app.get('/api/open', jwt({ secret: publicKey }), (req, res) => open(req, res))
app.get('/api/close', jwt({ secret: publicKey }), (req, res) => close(req, res))
app.get('/api/is-open', (req, res) => isOpen(res))

// const credentials = {
//   key: fs.readFileSync('switch.key', 'utf8'),
//   cert: fs.readFileSync('switch.cert', 'utf8')
// }
// https.createServer(credentials, app).listen(8000, function() {
//   console.log('Server listening on port 8000!')
// })

app.listen(8000, () => {
  console.log(`Server listening on port 8000!`)
})
