exports.up = function (knex, Promise) {
  return knex.schema.createTable('user_profiles', table => {
    table.bigInteger('user_id').unsigned().notNullable()
    table.string('display_name')
    table.enum('gender', ['f', 'm', 'u', 'o'])
    table.date('date_of_birth')
    table.text('description')
    table.string('mobile')
    table.string('email')
    table.string('language').defaultTo('en-US')
    table.string('country')
    table.string('state')
    table.string('city')
    table.string('location')
    table.string('avatar')
    table.string('grade')
    table.string('parent_name')
    table.timestamp('create_at').defaultTo(knex.fn.now())
    table.timestamp('update_at').defaultTo(knex.fn.now())

    table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('user_profiles')
}
