import debug from 'debug'
import meals from '../lib/meals'

const express = require('express')
const router = express.Router()

const log = debug('panf:routes:meal:info')
const logdebug = debug('panf:routes:meal:debug')
log.log = console.log.bind(console)
logdebug.log = console.log.bind(console)

module.exports = function (panfIO) {
  router.get('/', async (req, res) => {
    try {
      const mealList = await meals.read(req.query)
      res.json(mealList)
    } catch (error) {
      res.status(500).json(error.toString())
    }
  })

  router.get('/:id', async (req, res) => {
    try {
      const meal = await meals.readOne(req.params.id)
      res.json(meal)
    } catch (error) {
      res.status(500).json(error.toString())
    }
  })

  router.post('/', async (req, res) => {
    try {
      await meals.create(req.body)
      res.json({ status: 'created' })
    } catch (error) {
      res.status(500).json(error.toString())
    }
  })

  router.put('/:id', async (req, res) => {
    try {
      await meals.update(req.params.id, req.body)
      res.json({ status: 'updated' })
    } catch (error) {
      res.status(500).json(error.toString())
    }
  })

  router.delete('/:id', async (req, res) => {
    try {
      await meals.delete(req.params.id)
      res.json({ status: 'deleted' })
    } catch (error) {
      res.status(500).json(error.toString())
    }
  })

  return router
}
