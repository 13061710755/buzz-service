exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_social_accounts', table => {
        table.biginteger('user_id').unsigned().notNullable()
        table.string('facebook_id')
        table.string('facebook_name')
        table.json('facebook_data')
        table.string('wechat_openid')
        table.string('wechat_unionid')
        table.string('wechat_name')
        table.json('wechat_data')

        table.foreign('user_id').references('users.user_id').onDelete('CASCADE').onUpdate('CASCADE')
    })
}

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user_social_accounts')
}
