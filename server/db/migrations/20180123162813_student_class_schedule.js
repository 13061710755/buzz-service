exports.up = function (knex, Promise) {
    return knex.schema.createTable('student_class_schedule', table => {
        table.biginteger('user_id');
        table.biginteger('class_id');
        table.dateTime('start_time');
        table.dateTime('end_time');
        table.enum('status', ['booking', 'cancelled', 'confirmed', 'ready', 'started', 'ended', 'terminated']);
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('student_class_schedule');
};
