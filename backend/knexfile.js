// Update with your config settings.
const config = require('./config')
const path = require('path')

module.exports = {
  development: {
    client: 'pg',
    connection: config.postgres.devel.connectionString,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, '/knex/migrations'),
      tableName: `${config.postgres.devel.database}_knex_migrations`
    },
    seeds: {
      directory: path.join(__dirname, '/knex/seeds')
    }
  },
  /*
  staging: {
    client: 'pg',
    connection: {
      host: config.postgres.devel.host,
      database: config.postgres.staging.database,
      user: config.postgres.staging.user,
      password: config.postgres.staging.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: `${config.postgres.staging.database}_knex_migrations`
    }
  },
  */

  production: {
    client: 'pg',
    connection: config.postgres.production.connectionString,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, '/knex/migrations'),
      tableName: `${config.postgres.production.database}_knex_migrations`
    },
    seeds: {
      directory: path.join(__dirname, '/knex/seeds')
    }
  }
}
