const promisify = require('../common/promisify')
const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);
const list = async ctx => {
    try {
        let start_time = ctx.query.start_time;
        if (start_time) {
            start_time = new Date(start_time);
        } else {
            start_time = new Date(0, 0, 0);
        }

        let end_time = ctx.query.end_time;
        if (end_time) {
            end_time = new Date(end_time);
        } else {
            end_time = new Date(9999, 11, 30);
        }

        ctx.body = await selectSchedules()
            .where('users.user_id', ctx.params.user_id)
            .andWhere('student_class_schedule.start_time', '>=', start_time)
            .andWhere('student_class_schedule.end_time', '<=', end_time);
    } catch (error) {
        console.error(error);
        ctx.throw(500, error);
    }
};

let selectSchedules = function () {
    return knex('users')
        .leftJoin('student_class_schedule', 'users.user_id', 'student_class_schedule.user_id')
        .select('users.user_id as user_id', 'student_class_schedule.status as status', 'student_class_schedule.start_time as start_time', 'student_class_schedule.end_time as end_time');
};
module.exports = {list};