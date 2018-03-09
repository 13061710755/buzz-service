const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);

let selectFeedback = function () {
    return knex('classes')
        .leftJoin('class_feedback', 'classes.class_id', 'class_feedback.class_id')
        .leftJoin('companion_class_schedule', 'classes.class_id', 'companion_class_schedule.class_id')
        .leftJoin('user_profiles', 'companion_class_schedule.user_id', 'user_profiles.user_id')
        .select('class_feedback.class_id as class_id', 'class_feedback.from_user_id as from_user_id', 'class_feedback.to_user_id as to_user_id', 'class_feedback.score as score', 'class_feedback.comment as comment', 'classes.topic as topic', 'classes.start_time as start_time', 'classes.end_time as end_time', 'user_profiles.display_name as companion_name', 'user_profiles.avatar as companion_avatar');
};

let selectFeedbackList = function () {
    return knex('classes')
        .leftJoin('class_feedback', 'classes.class_id', 'class_feedback.class_id')
        .select('class_feedback.class_id as class_id', 'class_feedback.from_user_id as from_user_id', 'class_feedback.to_user_id as to_user_id', 'class_feedback.score as score', 'class_feedback.comment as comment', 'classes.topic as topic', 'classes.start_time as start_time', 'classes.end_time as end_time');
};

const getFeedbackList = async ctx => {
    try {
        let feedback = await selectFeedback()
                .where('class_feedback.class_id', ctx.params.class_id)
                .andWhere('class_feedback.from_user_id', ctx.params.from_user_id)
                .andWhere('class_feedback.to_user_id', ctx.params.to_user_id);

        ctx.status = 201;
        ctx.set('Location', `${ctx.request.URL}/${ctx.params.class_id}/${ctx.params.from_user_id}/evaluate/${ctx.params.to_user_id}`);
        ctx.body = feedback;
    }
    catch (ex) {
        console.error(ex);
        ctx.throw(409, ex);
    }
};

const setFeedbackInfo = async ctx => {
    let {body} = ctx.request;
    let data = body.map(b => Object.assign({class_id: ctx.params.class_id, from_user_id: ctx.params.form_user_id, to_user_id: ctx.params.to_user_id}, b));

    try {
        let inserted = await knex('class_feedback')
            .returning('class_id')
            .insert(data)
        ;

        ctx.status = 201;
        ctx.set('Location', `${ctx.request.URL}/${ctx.params.user_id}/${ctx.params.form_user_id}/evaluate/${ctx.params.to_user_id}`);
        ctx.body = inserted;
    } catch (ex) {
        console.error(ex);
        ctx.throw(409, ex);
    }
};

const getAdminFeedbackList = async ctx => {
    try {
        let feedback = await selectFeedbackList();

        ctx.status = 201;
        ctx.set('Location', `${ctx.request.URL}/admin-list`);
        ctx.body = feedback;
    }
    catch (ex) {
        console.error(ex);
        ctx.throw(409, ex);
    }
};


module.exports = {getFeedbackList, setFeedbackInfo, getAdminFeedbackList};