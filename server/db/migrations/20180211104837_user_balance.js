exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_balance', table => {
        table.bigInteger('user_id').unsigned().notNullable()
        table.integer('class_hours')

        table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE')
        table.primary(['user_id'])
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user_balance')
}
