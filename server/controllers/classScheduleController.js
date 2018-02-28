const Scheduling = require("../bll/scheduling");

const promisify = require('../common/promisify');
const env = process.env.NODE_ENV || "test";
const config = require("../../knexfile")[env];
const knex = require("knex")(config);
const listSuggested = async ctx => {
    try {
        let timeRangeStart = new Date(ctx.query.time_range_start).getTime();

        let res = await knex('student_class_schedule')
            .where('student_class_schedule.start_time', '>=', timeRangeStart)
            .andWhere('student_class_schedule.status', 'booking')
        ;
        let suggestions = Scheduling.makeGroups(res);
        console.log('res = ', res);
        ctx.body = res;
    } catch (error) {
        console.error(error);
        ctx.throw(500, error);
    }
};

const list = async ctx => {
    ctx.body = await knex('classes')
        .select('class_id', 'adviser_id', 'start_time', 'end_time', 'status', 'name', 'remark', 'topic');
};

module.exports = {listSuggested, list};