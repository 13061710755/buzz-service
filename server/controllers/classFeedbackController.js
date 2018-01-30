const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);

let selectFeedback = function () {
    return knex('classes')
        .leftJoin('class_feedback', 'classes.class_id', 'class_feedback.class_id')
        .select('class_feedback.class_id as class_id', 'class_feedback.from_user_id as from_user_id', 'class_feedback.to_user_id as to_user_id', 'class_feedback.score as score', 'class_feedback.comment as comment');
};

const getFeedbackList = async ctx => {
    try {
        let feedback = await selectFeedback()
            .where('classes.class_id', ctx.params.class_id);

        ctx.status = 201;
        ctx.set('Location', `${ctx.request.URL}/${ctx.params.class_id}`);
        ctx.body = feedback;
    }
    catch (ex) {
        console.error(ex);
        ctx.throw(409, ex);
    }
};

const setFeedbackInfo = async ctx => {
    //save feedback
    let {body} = ctx.request;
    let data = body.map(b => Object.assign({class_id: ctx.params.class_id}, b));

    try {
        let inserted = await knex('class_feedback')
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


module.exports = {getFeedbackList, setFeedbackInfo};