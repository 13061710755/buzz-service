
exports.up = function (knex, Promise) {
    return knex.schema.table('user_balance_history', table => {
        table.enum('type', ['h', 'i'])
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.table('user_balance_history', table => {
        table.dropColumn('type')
    })
}
