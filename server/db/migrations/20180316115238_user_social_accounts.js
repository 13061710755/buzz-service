exports.up = function (knex, Promise) {
    return knex.schema.alterTable('user_social_accounts', table => {
        table.unique('wechat_openid');
        table.unique('wechat_unionid');
        table.unique('facebook_id');
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('user_social_accounts', table => {
        table.dropUnique('wechat_openid');
        table.dropUnique('wechat_unionid');
        table.dropUnique('facebook_id')
    })
};
