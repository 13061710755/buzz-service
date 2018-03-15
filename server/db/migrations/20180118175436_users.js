exports.up = function (knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.bigIncrements('user_id');
        table.string('name');
        table.enum('role', ['s', 'c', 'a']);
        table.timestamp('created_at').defaultTo(knex.fn.now());

        // table.primary('user_id');
    }).then(() => {
        return knex.schema.table('users', table => {
            table.text('remark');
        })
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('users');
};
