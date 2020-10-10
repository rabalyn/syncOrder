const knex = require('../../knex/knex.js')

async function _create (ingridient) {
  const { name, price } = ingridient

  if (!name) throw Error('name missing')
  if (price && !parseFloat(price)) throw Error('price not parsable')

  try {
    await knex('ingredients')
      .insert({
        name: name,
        price: parseFloat(price)
      })
  } catch (error) {
    throw Error(error)
  }
}

async function _read (qry) {
  const { limit, offset, search } = qry
  try {
    let ingridientsQry = knex('ingredients')
      .select()
      .limit(limit || 15)
      .offset(offset || 0)

    if (search) {
      ingridientsQry = ingridientsQry.where({ name: `%${search}%` })
    }

    const ingridients = await ingridientsQry

    return ingridients
  } catch (error) {
    throw Error(error)
  }
}

async function _readOne (id) {
  try {
    const ingridient = await knex('ingredients')
      .select()
      .where({ id })
      .first()

    return ingridient
  } catch (error) {
    throw Error(error)
  }
}

async function _update (id, newIngridient) {
  const { name, price } = newIngridient

  if (!id) throw Error('id missing')
  if (!price && !name) throw Error('nothing to update')
  if (price && !parseFloat(price)) throw Error('price not parsable')

  try {
    await knex('ingredients')
      .update(newIngridient)
      .where({ id })

    return true
  } catch (error) {
    throw Error(error)
  }
}

async function _delete (id) {
  try {
    const ingridient = await knex('ingredients')
      .delete()
      .where({ id })

    return ingridient
  } catch (error) {
    throw Error(error)
  }
}

module.exports = {
  create: _create,
  read: _read,
  readOne: _readOne,
  update: _update,
  delete: _delete
}
