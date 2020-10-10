const ingredients = require('../../lib/ingredients')

const express = require('express')
const router = express.Router()

module.exports = function (panfIO) {
  router.get('/', async (req, res) => {
    try {
      const mealList = await ingredients.read(req.query)
      res.json(mealList)
    } catch (error) {
      res.status(500).json(error.toString())
    }
  })

  router.get('/:id', async (req, res) => {
    try {
      const meal = await ingredients.readOne(req.params.id)
      res.json(meal)
    } catch (error) {
      res.status(500).json(error.toString())
    }
  })

  router.post('/', async (req, res) => {
    try {
      await ingredients.create(req.body)
      res.json({ status: 'created' })
    } catch (error) {
      res.status(500).json(error.toString())
    }
  })

  router.put('/:id', async (req, res) => {
    try {
      await ingredients.update(req.params.id, req.body)
      res.json({ status: 'updated' })
    } catch (error) {
      res.status(500).json(error.toString())
    }
  })

  router.delete('/:id', async (req, res) => {
    try {
      await ingredients.delete(req.params.id)
      res.json({ status: 'deleted' })
    } catch (error) {
      res.status(500).json(error.toString())
    }
  })

  return router
}
