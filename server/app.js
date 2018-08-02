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

import { API_PORT, WEBSOCKET_PORT } from '../config.js'

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

var socket = require('socket.io')(WEBSOCKET_PORT)

const publicKey = fs.readFileSync('./jwtRS256.key.pub')

app.get(
	'/api/open',
	jwt({ secret: publicKey, algorithms: ['RS256'] }),
	(req, res) => open(req, res, socket)
)
app.get(
	'/api/close',
	jwt({ secret: publicKey, algorithms: ['RS256'] }),
	(req, res) => close(req, res, socket)
)
app.get('/api/is-open', (req, res) => isOpen(res))

// const credentials = {
//   key: fs.readFileSync('switch.key', 'utf8'),
//   cert: fs.readFileSync('switch.cert', 'utf8')
// }
// https.createServer(credentials, app).listen(8000, function() {
//   console.log('Server listening on port 8000!')
// })

app.listen(API_PORT, () => {
	console.log(`Server listening on port ${API_PORT}!`)
})
