const promisify = require('../common/promisify')
const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);

async function getUserPlacementTest(trx, user_id) {
    return await trx('user_placement_tests')
        .select('level', 'detail')
        .where({user_id: user_id});
}

const upsert = async ctx => {
    const {body} = ctx.request;

    let trx = await promisify(knex.transaction);

    try {
        let current = await getUserPlacementTest(trx, ctx.params.user_id);

        if (current.length > 0) {
            await trx('user_placement_tests')
                .update({
                    level: body.level,
                    detail: body.detail
                })
                .where({user_id: ctx.params.user_id});
        } else {
            await trx("user_placement_tests")
                .insert({
                    level: body.level,
                    detail: body.detail,
                    user_id: ctx.params.user_id
                });
        }

        await trx.commit();

        ctx.status = 201;
        ctx.set("Location", `${ctx.request.URL}`);
        ctx.body = (await knex('user_placement_tests').select('detail', 'level').where({user_id: ctx.params.user_id}))[0];
    } catch (error) {
        console.error(error);

        await trx.rollback();
        ctx.status = 500;
        ctx.body = {
            error: "Upsert failed!"
        };
    }
};

const query = async ctx => {
    ctx.body = (await knex('user_placement_tests').select('detail', 'level').where({user_id: ctx.params.user_id}))[0];
};

module.exports = {upsert: upsert, query: query};