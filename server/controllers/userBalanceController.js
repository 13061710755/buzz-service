const promisify = require('../common/promisify')
const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);

const charge = async ctx => {
    const {body} = ctx.request;

    if (isNaN(body.class_hours) || body.class_hours <= 0) {
        ctx.throw(400, 'class_hours should be a positive number!');
    }

    let trx = await promisify(knex.transaction);

    try {
        await trx("user_balance_history")
            .insert({
                user_id: ctx.params.user_id,
                type: 'h',
                event: 'charge',
                amount: body.class_hours
            });

        const currentClassHours = await trx('user_balance')
            .select('class_hours')
            .where({user_id: ctx.params.user_id})
        ;

        if (currentClassHours.length > 0) {
            await trx('user_balance').update({
                user_id: ctx.params.user_id,
                class_hours: body.class_hours + currentClassHours
            });
        } else {
            await trx('user_balance').insert({
                user_id: ctx.params.user_id,
                class_hours: body.class_hours + currentClassHours
            });
        }

        await trx.commit();

        ctx.status = 201;
        ctx.set("Location", `${ctx.request.URL}`);
        ctx.body = (await knex('user_balance').select('class_hours').where({user_id: ctx.params.user_id}))[0];
    } catch (error) {
        console.error(error);

        await trx.rollback();
        ctx.status = 500;
        ctx.body = {
            error: "Charge failed!"
        };
    }
};

module.exports = {charge};