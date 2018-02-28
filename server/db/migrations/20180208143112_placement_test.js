exports.up = function (knex, Promise) {
    return knex.schema.createTable('placement_test', table => {
        table.bigInteger('user_id');
        table.dateTime('test_time');
        table.text('placement_content');
        table.string('level');
        table.string('remark');

        table.foreign('user_id').references('users.user_id');

        table.primary(['user_id']);
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('placement_test');
};
