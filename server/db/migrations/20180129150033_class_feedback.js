exports.up = function (knex, Promise) {
    return knex.schema.createTable('class_feedback', table => {
        table.bigInteger('class_id');
        table.bigInteger('from_user_id');
        table.bigInteger('to_user_id');
        table.dateTime('feedback_time');
        table.decimal('score');
        table.string('comment');
        table.text('remark');

        table.foreign('class_id').references('classes.class_id');
        table.foreign('from_user_id').references('users.user_id');
        table.foreign('to_user_id').references('users.user_id');

        table.primary(['class_id', 'from_user_id', 'to_user_id'])
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('class_feedback');
};
