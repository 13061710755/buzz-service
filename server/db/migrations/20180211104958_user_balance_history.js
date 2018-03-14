exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_balance_history', table => {
        table.bigInteger('user_id').unsigned().notNullable();
        table.timestamp('timestamp').defaultTo(knex.fn.now());
        table.enum('type', ['h']);
        table.enum('event', ['charge', 'consume']);
        table.decimal('amount', 8, 2);
        table.text('remark');

        table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user_balance_history');
};
