exports.up = function (knex, Promise) {
    return knex.schema.createTable('companion_class_schedule', table => {
        table.biginteger('user_id').unsigned().notNullable()
        table.biginteger('class_id').unsigned().nullable()
        table.dateTime('start_time')
        table.dateTime('end_time')
        table.enum('status', ['booking', 'cancelled', 'confirmed', 'ready', 'started', 'ended', 'terminated'])

        table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE')
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('companion_class_schedule')
}
