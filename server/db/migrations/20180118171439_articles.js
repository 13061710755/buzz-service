exports.up = function (knex, Promise) {
    return knex.schema.createTable('articles', table => {
        table.increments();
        table.string('title').notNullable().unique();
        table.text('body').notNullable();
        table.string('tags').notNullable();
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('articles');
};
