exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('devices', (table) => {
      table.increments()
      table.string('name')
      table.string('shortname')
      table.datetime('created_at')
    }),

    knex.schema.createTable('device_readings', (table) => {
      table.increments()
      table.integer('device_id')
      table.foreign('device_id').references('devices.id')
      table.json('reading_data')
      table.datetime('created_at')
    })
  ])
};

exports.down = function(knex, Promise) {

};
