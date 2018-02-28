exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_placement_tests', table => {
        table.bigInteger('user_id');
        table.json('detail');
        table.string('level');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.primary('user_id');
        table.foreign('user_id').references('users.user_id');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user_placement_tests');
};
