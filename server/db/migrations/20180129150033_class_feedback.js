exports.up = function (knex, Promise) {
  return knex.schema.createTable('class_feedback', table => {
    table.bigInteger('class_id').unsigned().notNullable()
    table.bigInteger('from_user_id').unsigned().notNullable()
    table.bigInteger('to_user_id').unsigned().notNullable()
    table.dateTime('feedback_time')
    table.decimal('score')
    table.string('comment')
    table.text('remark')

    table.foreign('class_id').references('classes.class_id').onDelete('CASCADE').onUpdate('CASCADE')
    table.foreign('from_user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE')
    table.foreign('to_user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE')

    table.primary(['class_id', 'from_user_id', 'to_user_id'])
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('class_feedback')
}
