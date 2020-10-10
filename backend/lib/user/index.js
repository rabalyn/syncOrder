import knex from '../../knex/knex.js'
import bcrypt from 'bcrypt'
const HASHROUNDS = 10

async function create (newUser) {
  const { username, password } = newUser
  try {
    const user = await knex
      .first('username')
      .from('users')
      .where({
        username: username
      })

    if (user) {
      return null
    }
  } catch (error) {
    return new Error(error)
  }

  try {
    const hash = await bcrypt.hash(password, HASHROUNDS)
    await knex('users')
      .insert({
        username: username,
        displayname: username,
        email: '',
        password: hash
      })
  } catch (error) {
    return new Error(error)
  }

  return true
}

async function authorize (username, password) {
  const user = await read(username)
  const userPpassword = user.password

  return await bcrypt.compare(password, userPpassword)
}

async function read (username) {
  try {
    return await knex('users')
      .where(username)
      .first()
  } catch (error) {
    return new Error(error)
  }
}

async function readAll () {
  try {
    return await knex('users')
  } catch (error) {
    return new Error(error)
  }
}

async function update (id, updateOpts) {
  try {
    await knex('users')
      .update(updateOpts)
      .where(id)
  } catch (error) {
    return new Error(error)
  }
}

async function remove (id) {
  try {
    await knex('users')
      .where(id)
      .delete()
  } catch (error) {
    return new Error(error)
  }
}

module.exports = {
  create,
  read,
  readAll,
  authorize,
  update,
  remove
}
