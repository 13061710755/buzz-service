const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);

let placement = function () {
    return knex('users')
        .leftJoin('placement_test', 'users.user_id', 'placement_test.user_id')
        .select('placement_test.user_id as user_id', 'placement_test.placement_content as placement_content', 'placement_test.test_time as test_time', 'placement_test.level as level');
};

const getPlacementTest = async ctx => {
    try {
        let placement_result = await placement();

        ctx.status = 201;
        ctx.set('Location', `${ctx.request.URL}/`);
        ctx.body = placement_result;
    }
    catch (ex) {
        console.error(ex);
        ctx.throw(409, ex);
    }
};

const savePlacementTest = async ctx => {
    let {body} = ctx.request;
    let data = body.map(b => Object.assign({user_id: ctx.params.user_id}, b));

    try {
        let inserted = await knex('placement_test')
                .returning('user_id')
                .insert(data)
            ;

        ctx.status = 201;
        ctx.set('Location', `${ctx.request.URL}/${ctx.params.user_id}`);
        ctx.body = inserted;
    } catch (ex) {
        console.error(ex);
        ctx.throw(409, ex);
    }
};

module.exports = {getPlacementTest, savePlacementTest};