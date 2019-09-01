function addTimeStamps(knex, name) {
  return knex.schema.then(() => {
    // We need to ensure the function exists, then add the table trigger
    return knex.raw(`
        CREATE OR REPLACE FUNCTION update_modified_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = now();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_${name}_updated_at
        BEFORE UPDATE ON ${name}
        FOR EACH ROW
        EXECUTE PROCEDURE update_modified_column();
      `)
  })
}

const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = 'DROP FUNCTION update_modified_column'

exports.up = function(knex) {
  return addTimeStamps(knex, 'meta')
}

exports.down = (knex) => knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION)
