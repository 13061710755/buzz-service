exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_balance_history', table => {
        table.bigInteger('user_id');
        table.timestamp('timestamp').defaultTo(knex.fn.now());
        table.enum('type', ['h']);
        table.enum('event', ['charge', 'consume']);
        table.decimal('amount', 8, 2);

        table.foreign('user_id').references('users.user_id');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user_balance_history');
};
