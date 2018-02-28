exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_balance', table => {
        table.bigInteger('user_id');
        table.int('class_hours');

        table.foreign('user_id').references('users.user_id');
        table.primary(['user_id'])
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user_balance');
};
