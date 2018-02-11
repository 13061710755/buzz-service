exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_balance', table => {
        table.bigInteger('user_id');
        table.int('class_hours');
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user_balance');
};
