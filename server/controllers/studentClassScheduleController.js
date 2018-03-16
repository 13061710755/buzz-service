const promisify = require('../common/promisify')
const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);
const moment = require('moment');

let uniformTime = function (theStartTime, theEndTime) {
    let start_time = theStartTime;
    if (start_time) {
        start_time = new Date(start_time);
    } else {
        start_time = new Date(0, 0, 0);
    }

    let end_time = theEndTime;
    if (end_time) {
        end_time = new Date(end_time);
    } else {
        end_time = new Date(9999, 11, 30);
    }
    return {start_time, end_time};
};
const list = async ctx => {
    try {
        let {start_time, end_time} = uniformTime(ctx.query.start_time, ctx.query.end_time);

        ctx.body = await selectSchedulesWithMoreInfo()
            .where('student_class_schedule.user_id', ctx.params.user_id)
            .andWhere('student_class_schedule.start_time', '>=', start_time)
            .andWhere('student_class_schedule.end_time', '<=', end_time);
    } catch (error) {
        console.error(error);
        ctx.throw(500, error);
    }
};

let selectSchedulesWithMoreInfo = function () {
    return knex('student_class_schedule')
        .leftJoin('classes', 'student_class_schedule.class_id', 'classes.class_id')
        .leftJoin('companion_class_schedule', 'classes.class_id', 'companion_class_schedule.class_id')
        .leftJoin('user_profiles', 'companion_class_schedule.user_id', 'user_profiles.user_id')
        .leftJoin('class_feedback', 'class_feedback.from_user_id', 'student_class_schedule.user_id')
        .select('student_class_schedule.user_id as user_id', 'student_class_schedule.class_id as class_id', 'student_class_schedule.status as status',
            'classes.start_time as start_time', 'classes.end_time as end_time',
            'classes.status as classes_status', 'classes.topic as topic', 'user_profiles.display_name as companion_name', 'classes.name as title',
            'user_profiles.avatar as companion_avatar', 'class_feedback.from_user_id as from_user_id', 'class_feedback.to_user_id as to_user_id',  'class_feedback.score as score', 'class_feedback.comment as comment');
}

const listAll = async ctx => {
    ctx.body = await selectSchedules();
}

let selectSchedules = function () {
    return knex('student_class_schedule')
        .select('user_id', 'class_id', 'status', 'start_time', 'end_time');
};

let checkTimeConflictsWithDB = async function (user_id, time, start_time, end_time) {
    let selected = await knex('student_class_schedule')
        .where('user_id', '=', user_id)
        .andWhere(time, '>=', start_time.getTime())
        .andWhere(time, '<=', end_time.getTime())
        .select('student_class_schedule.user_id')
    ;

    if (selected.length > 0) {
        throw new Error(`Schedule ${time} conflicts!`);
    }
};

function checkTimeConflicts(data) {
    for (let i = 0; i < data.length - 1; i++) {
        for (let j = i + 1; j < data.length; j++) {
            if (
                (data[i].start_time >= data[j].start_time
                    && data[i].start_time <= data[j].end_time) ||
                (data[i].end_time >= data[j].start_time
                    && data[i].end_time <= data[j].end_time)) {

                throw new Error('schedule conflicts!');
            }
        }
    }
}

let uniformTimes = function (data) {
    for (let i = 0; i < data.length; i++) {
        let u = uniformTime(data[i].start_time, data[i].end_time);
        data[i].start_time = u.start_time;
        data[i].end_time = u.end_time;
    }
};
const create = async ctx => {
    let {body} = ctx.request;
    let data = body.map(b => Object.assign({user_id: ctx.params.user_id}, b));

    try {
        uniformTimes(data);
        checkTimeConflicts(data);

        for (let i = 0; i < data.length; i++) {
            await checkTimeConflictsWithDB(ctx.params.user_id, 'start_time', data[i].start_time, data[i].end_time);
            await checkTimeConflictsWithDB(ctx.params.user_id, 'end_time', data[i].start_time, data[i].end_time);
        }

        let inserted = await knex('student_class_schedule')
            .returning('start_time')
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

const cancel = async ctx => {
    try {
        let {body} = ctx.request;
        let startTime = moment(body.start_time).toISOString().replace('T', ' ').substr(0, 19);

        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'test') {
            startTime = new Date(body.start_time).getTime();
        }

        let filter = {
            'user_id': ctx.params.user_id,
            'start_time': startTime
        };
        let res = await knex('student_class_schedule').where(filter).andWhere({status: 'booking'}).update({
            'status': 'cancelled'
        });

        if (res > 0) {
            ctx.body = (await knex('student_class_schedule')
                .where(filter)
                .select('user_id', 'status'))[0];
        } else if (res === 0) {
            throw new Error('trying to cancel a non-exist event @ ' + startTime);
        } else {
            throw new Error(res);
        }
    } catch (ex) {
        console.error(ex);
        ctx.throw(500, ex);
    }
};
module.exports = {list, create, cancel, listAll};