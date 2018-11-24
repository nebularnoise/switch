import cache from 'memory-cache'
import { getFunctions } from './push.js'
const functionsFromise = getFunctions()

const open = async (req, res, socket) => {
	if (!req.user.admin) {
		return res.sendStatus(401)
	} else {
		try {
			cache.put('status', true)
			console.log('OPEN !')
			res.status(200).json(true)
			socket.emit('open')
			const { broadcast } = await functionsFromise
			broadcast('true')
		} catch (error) {
			console.log('An error occured: \n' + error)
			res.status(400).json(error)
		}
	}
}

const close = async (req, res, socket) => {
	if (!req.user.admin) {
		return res.sendStatus(401)
	} else {
		try {
			cache.put('status', false)
			console.log('CLOSED !')
			res.status(200).json(false)
			socket.emit('close')
			const { broadcast } = await functionsFromise
			broadcast('false')
		} catch (error) {
			console.log('An error occured: \n' + error)
			res.status(400).json(error)
		}
	}
}

const isOpen = async res => {
	try {
		let status = cache.get('status')
		if (status === null || status === undefined) status = false
		console.log(`Returning: ${status}`)
		res.status(200).json({ status })
	} catch (error) {
		console.log('An error occured: \n' + error)
		res.status(400).json({ error })
	}
}

module.exports = { open, isOpen, close }
