
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('user_balance', table => {
        table.integer('integral')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('user_balance', table => {
        table.dropColumn('integral')
    })
};
