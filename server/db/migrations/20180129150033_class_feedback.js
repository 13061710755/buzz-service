exports.up = function (knex, Promise) {
    return knex.schema.createTable('class_feedback', table => {
        table.bigIncrements('class_id');
        table.biginteger('from_user_id');
        table.biginteger('to_user_id');
        table.dateTime('feedback_time');
        table.enum('score', [1, 2, 3, 4, 5]);
        table.string('comment');
        table.text('remark');
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('class_feedback');
};
