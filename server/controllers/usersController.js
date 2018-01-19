const promisify = require('../common/promisify')
const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);
const index = async ctx => {
    try {
        ctx.body = await knex("users")
            .leftJoin('user_profiles', 'users.user_id', 'user_profiles.user_id')
            .leftJoin('user_social_accounts', 'users.user_id', 'user_social_accounts.user_id')
            .select('users.user_id', 'users.name', 'users.created_at', 'users.role', 'user_profiles.avatar', 'user_social_accounts.facebook_id', 'user_social_accounts.wechat_data');
    } catch (error) {
        console.error(error);
    }
};
const show = async ctx => {
    try {
        const {user_id} = ctx.params;
        let users = await knex("users")
            .leftJoin('user_profiles', 'users.user_id', 'user_profiles.user_id')
            .leftJoin('user_social_accounts', 'users.user_id', 'user_social_accounts.user_id')
            .select('users.user_id as user_id', 'users.name', 'users.created_at', 'users.role', 'user_profiles.avatar', 'user_social_accounts.facebook_id', 'user_social_accounts.wechat_data')
            .where({'users.user_id': user_id});

        if (!users.length) {
            throw new Error("The requested user does not exists");
        }

        ctx.body = users[0];
    } catch (error) {
        console.error(error);

        ctx.status = 404;
        ctx.body = {
            error: error.message
        };
    }
};

const create = async ctx => {
    let trx = await promisify(knex.transaction);

    try {
        const {body} = ctx.request;

        const users = await trx("users").insert({
            name: body.name || '',
            role: body.role,
            created_at: new Date()
        });
        if (!users.length) {
            throw new Error("The user already exists");
        }

        const userProfile = await trx('user_profiles').insert({
            user_id: users[0],
            avatar: body.avatar || ''
        });

        const userSocialAccounts = await trx('user_social_accounts').insert({
            user_id: users[0],
            facebook_id: body.facebook_id || null,
            facebook_name: body.facebook_name || '',
            wechat_openid: body.wechat_openid || null,
            wechat_unionid: body.wechat_unionid || null
        });

        await trx.commit();

        ctx.status = 201;
        ctx.set("Location", `${ctx.request.URL}/${users[0]}`);
        ctx.body = users[0];
    } catch (error) {
        console.error(error);

        await trx.rollback();
        ctx.status = 409;
        ctx.body = {
            error: "The user already exists"
        };
    }
};
module.exports = {index, show, create};