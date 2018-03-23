exports.up = function (knex, Promise) {
    return knex.schema.table('user_profiles', table => {
        table.string('password')
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.table('user_profiles', table => {
        table.dropColumn('password')
    })
}
