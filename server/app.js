import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'express-jwt'
import fs from 'fs'
import morgan from 'morgan'
import cache from 'memory-cache'

import { open, isOpen, close } from './routes'

import { API_PORT, WEBSOCKET_PORT } from '../config.js'
import { getFunctions } from './push.js'
const functionsFromise = getFunctions()

const app = express()

app.use(morgan('common'))
app.use(helmet())
app.use(bodyParser.json())
app.use(
	cors({
		methods: ['GET', 'POST'],
		allowedHeaders: ['Content-Type', 'Authorization']
	})
)
app.use(compression())

var socket = require('socket.io')(WEBSOCKET_PORT)
socket.on('connection', s => {
	cache.get('status') ? s.emit('open') : s.emit('close')
})

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

app.post('/api/push/register', async (req, res) => {
	const subscription = req.body.subscription
	console.log(subscription)
	res.status(201).json()
	const { subscribe } = await functionsFromise
	subscribe(subscription)
})

app.delete('/api/push/unregister/:id', async (req, res) => {
	res.status(200)
	const { unsubscribe } = await functionsFromise
	unsubscribe(req.params.id)
})

app.listen(API_PORT, () => {
	console.log(`Server listening on port ${API_PORT}!`)
})
