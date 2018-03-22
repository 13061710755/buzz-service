exports.up = function (knex, Promise) {
    return knex.schema.table('users', table => {
        table.text('remark')
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.table('users', table => {
        table.dropColumn('remark')
    })
}
