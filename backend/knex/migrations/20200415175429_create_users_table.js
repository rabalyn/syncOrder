const tablename = 'users'

function addTimeStamps(knex, name) {
  return knex.schema.then(() => {
    return knex.raw(`
        CREATE OR REPLACE FUNCTION ${tablename}_update_modified_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = now();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_${name}_updated_at
        BEFORE UPDATE ON ${name}
        FOR EACH ROW
        EXECUTE PROCEDURE ${tablename}_update_modified_column();
      `)
  })
}

const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION ${tablename}_update_modified_column`

exports.up = async function(knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

  return knex.schema.createTable(tablename, function (table) {
    table.uuid('id').primary()
      .defaultTo(knex.raw('gen_random_uuid()'))
    table.string('username')
    table.string('displayname')
    table.string('password')
    table.string('email')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    addTimeStamps(knex, tablename)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(tablename).then(() => knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION))
}
