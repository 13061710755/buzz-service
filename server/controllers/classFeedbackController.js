const env = process.env.NODE_ENV || 'test'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)

const selectFeedback = function () {
    return knex('classes')
        .leftJoin('class_feedback', 'classes.class_id', 'class_feedback.class_id')
        .select('classes.class_id as class_id', 'class_feedback.from_user_id as from_user_id', 'class_feedback.to_user_id as to_user_id', 'class_feedback.score as score', 'class_feedback.comment as comment')
}

const selectFeedbackList = function () {
    return knex('classes')
        .leftJoin('class_feedback', 'classes.class_id', 'class_feedback.class_id')
        .select('class_feedback.class_id as class_id', 'class_feedback.from_user_id as from_user_id', 'class_feedback.to_user_id as to_user_id', 'class_feedback.score as score', 'class_feedback.comment as comment', 'classes.topic as topic', 'classes.start_time as start_time', 'classes.end_time as end_time')
}

const getFeedbackList = async ctx => {
    try {
        const feedback = await selectFeedback()
            .where('class_feedback.class_id', ctx.params.class_id)
            .andWhere('class_feedback.from_user_id', ctx.params.from_user_id)
            .andWhere('class_feedback.to_user_id', ctx.params.to_user_id)

        ctx.status = 201
        ctx.set('Location', `${ctx.request.URL}/${ctx.params.class_id}/${ctx.params.from_user_id}/evaluate/${ctx.params.to_user_id}`)
        ctx.body = feedback || {}
    } catch (ex) {
        console.error(ex)
        ctx.throw(409, ex)
    }
}

const setFeedbackInfo = async ctx => {
    const { body } = ctx.request
    const data = body.map(b => Object.assign({ class_id: ctx.params.class_id, from_user_id: ctx.params.from_user_id, to_user_id: ctx.params.to_user_id }, b))

    try {
        const inserted = await knex('class_feedback')
            .returning('class_id')
            .insert(data)

        ctx.status = 201
        ctx.set('Location', `${ctx.request.URL}/${ctx.params.user_id}/${ctx.params.from_user_id}/evaluate/${ctx.params.to_user_id}`)
        ctx.body = inserted
    } catch (ex) {
        console.error(ex)
        ctx.throw(409, ex)
    }
}

const getAdminFeedbackList = async ctx => {
    try {
        const feedback = await selectFeedbackList()

        ctx.status = 201
        ctx.set('Location', `${ctx.request.URL}/admin-list`)
        ctx.body = feedback
    } catch (ex) {
        console.error(ex)
        ctx.throw(409, ex)
    }
}

module.exports = { getFeedbackList, setFeedbackInfo, getAdminFeedbackList }
