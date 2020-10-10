const express = require('express')
const router = express.Router()

router.post('/register', async (req, res) => {
  const { body } = req
  const { username, password } = body

  const user = await knex
    .first('username')
    .from('users')
    .where({
      username: username
    })

  if (user) {
    log('username already exists')

    return res.json({ status: 'username already exists', register: false })
  }

  log('generating hash')
  const hash = await bcrypt.hash(password, HASHROUNDS)

  log('create user')
  await knex('users')
    .insert({
      username: username,
      displayname: username,
      email: '',
      password: hash
    })

  const TEMPORARY_REDIRECT = 307

  return res.redirect(TEMPORARY_REDIRECT, '/api/auth/login')
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = await knex
    .from('users')
    .where({
      username: username
    })
    .first()

  const userPassword = (user && user.password)
    ? user.password
    : null

  if (!userPassword) {
    return res.json(false)
  }

  const loginValid = await bcrypt.compare(password, userPassword)
  log(user)
  if (loginValid) {
    req.session.user = {
      id: user.id,
      username: user.username,
      displayname: user.displayname,
      email: user.email,
      isAuthed: true
    }
  }

  return res.json(req.session.user)
})

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logerror(err)
    }

    return res.redirect('/')
  })
})

module.exports = router
