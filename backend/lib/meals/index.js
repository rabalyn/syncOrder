import knex from '../../knex/knex.js'

async function _create (meal) {
  const { name, price } = meal

  if (!name) throw Error('name missing')
  if (!price) throw Error('price missing')
  if (!parseFloat(price)) throw Error('price not parsable')

  try {
    await knex('meals')
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
    let mealsQry = knex('meals')
      .select()
      .limit(limit || 25)
      .offset(offset || 0)

    if (search) {
      mealsQry = mealsQry.where({ name: `%${search}%` })
    }

    const meals = await mealsQry

    return meals
  } catch (error) {
    throw Error(error)
  }
}

async function _readOne (id) {
  try {
    const meal = await knex('meals')
      .select()
      .where({ id })
      .first()

    return meal
  } catch (error) {
    throw Error(error)
  }
}

async function _update (id, newMeal) {
  const { name, price } = newMeal

  if (!id) throw Error('id missing')
  if (!price && !name) throw Error('nothing to update')
  if (price && !parseFloat(price)) throw Error('price not parsable')

  try {
    await knex('meals')
      .update(newMeal)
      .where({ id })

    return true
  } catch (error) {
    throw Error(error)
  }
}

async function _delete (id) {
  try {
    const ingridient = await knex('meals')
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
