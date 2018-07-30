import cache from 'memory-cache'

const open = async res => {
  if (!req.user.admin) {
    return res.sendStatus(401)
  } else {
    try {
      cache.put('status', true)
      res.status(200).json(true)
    } catch (error) {
      console.log('An error occured: \n' + error)
      res.status(400).json(error)
    }
  }
}

const close = async res => {
  if (!req.user.admin) {
    return res.sendStatus(401)
  } else {
    try {
      cache.put('status', false)
      res.status(200).json(false)
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
    res.status(200).json(status)
  } catch (error) {
    console.log('An error occured: \n' + error)
    res.status(400).json({ error })
  }
}

module.exports = { open, isOpen, close }
