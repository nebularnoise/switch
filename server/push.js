import { GCM_API_KEY, PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY, MAILTO } from '../config.js'
import webpush from 'web-push'
import storage from 'node-persist'

webpush.setGCMAPIKey(GCM_API_KEY)
webpush.setVapidDetails(
	MAILTO,
	PUBLIC_VAPID_KEY,
	PRIVATE_VAPID_KEY
)

const broadcast = async status => {
	const subscribers = await storage.values()
	subscribers.forEach(subscription =>
		webpush.sendNotification(subscription, `${status}`).catch(error => {
			unsubscribe(subscription.keys.auth)
		})
	)
}

const subscribe = async subscription => {
	await storage.setItem(subscription.keys.auth, subscription)
}

const unsubscribe = async id => {
	await storage.removeItem(id)
}

export const getFunctions = async () => {
	await storage.init()
	return {
		broadcast,
		subscribe,
		unsubscribe
	}
}
