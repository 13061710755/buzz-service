const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);
const index = async ctx => {
    try {
        ctx.body = await knex("users")
            .leftJoin('user_profiles', 'users.user_id', 'user_profiles.user_id')
            .leftJoin('user_social_accounts', 'users.user_id', 'user_social_accounts.user_id')
            .select();
    } catch (error) {
        console.error(error);
    }
};
const show = async ctx => {
    try {
        const {id} = ctx.params;
        const article = await knex("articles")
            .select()
            .where({id});
        if (!article.length) {
            throw new Error("The requested resource does not exists");
        }
        ctx.body = {
            data: article
        };
    } catch (error) {
        ctx.status = 404;
        ctx.body = {
            error: error.message
        };
    }
};
const create = async ctx => {
    try {
        const {body} = ctx.request;
        const article = await knex("articles").insert(body);
        if (!article.length) {
            throw new Error("The resource already exists");
        }
        ctx.status = 201;
        ctx.set("Location", `${ctx.request.URL}/${article[0]}`);
        ctx.body = {
            data: article
        };
    } catch (error) {
        ctx.status = 409;
        ctx.body = {
            error: "The resource already exists"
        };
    }
};
module.exports = {index, show, create};