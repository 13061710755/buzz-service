exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.bigIncrements('user_id');
        table.string('name');
        table.enum('role', ['s', 'c', 'a']);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.text('remark');

        // table.primary('user_id');
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users');
};
