const env = process.env.NODE_ENV || 'test'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)
const uniformTime = function (theStartTime, theEndTime) {
  let start_time = theStartTime
  if (start_time) {
    start_time = new Date(start_time)
  } else {
    start_time = new Date(0, 0, 0)
  }

  let end_time = theEndTime
  if (end_time) {
    end_time = new Date(end_time)
  } else {
    end_time = new Date(9999, 11, 30)
  }
  return { start_time, end_time }
}

const selectSchedules = function () {
  return knex('companion_class_schedule')
    .select('user_id', 'class_id', 'status', 'start_time', 'end_time')
}
const listAll = async ctx => {
  ctx.body = await selectSchedules()
}

const list = async ctx => {
  try {
    const { start_time, end_time } = uniformTime(ctx.query.start_time, ctx.query.end_time)

    ctx.body = await selectSchedules()
      .where('user_id', ctx.params.user_id)
      .andWhere('start_time', '>=', start_time)
      .andWhere('end_time', '<=', end_time)
  } catch (error) {
    console.error(error)
    ctx.throw(500, error)
  }
}

const checkTimeConflictsWithDB = async function (user_id, time, start_time, end_time) {
  const selected = await knex('companion_class_schedule')
    .where('user_id', '=', user_id)
    .andWhere(time, '>=', start_time.getTime())
    .andWhere(time, '<=', end_time.getTime())
    .select('companion_class_schedule.user_id')

  if (selected.length > 0) {
    throw new Error(`Schedule ${time} conflicts!`)
  }
}

const uniformTimes = function (data) {
  for (let i = 0; i < data.length; i++) {
    const u = uniformTime(data[i].start_time, data[i].end_time)
    data[i].start_time = u.start_time
    data[i].end_time = u.end_time
  }
}

function checkTimeConflicts(data) {
  for (let i = 0; i < data.length - 1; i++) {
    for (let j = i + 1; j < data.length; j++) {
      if (
        (data[i].start_time >= data[j].start_time
                    && data[i].start_time <= data[j].end_time) ||
                (data[i].end_time >= data[j].start_time
                    && data[i].end_time <= data[j].end_time)) {
        throw new Error('schedule conflicts!')
      }
    }
  }
}

const create = async ctx => {
  const { body } = ctx.request
  const data = body.map(b => Object.assign({ user_id: ctx.params.user_id }, b))

  try {
    uniformTimes(data)
    checkTimeConflicts(data)

    for (let i = 0; i < data.length; i++) {
      /* eslint-disable */
            await checkTimeConflictsWithDB(ctx.params.user_id, 'start_time', data[i].start_time, data[i].end_time)
            await checkTimeConflictsWithDB(ctx.params.user_id, 'end_time', data[i].start_time, data[i].end_time)
            /* eslint-enable */
    }

    const inserted = await knex('companion_class_schedule')
      .returning('start_time')
      .insert(data)

    ctx.status = 201
    ctx.set('Location', `${ctx.request.URL}/${ctx.params.user_id}`)
    ctx.body = inserted
  } catch (ex) {
    console.error(ex)
    ctx.throw(409, ex)
  }
}

const cancel = async ctx => {
  try {
    const { body } = ctx.request
    const filter = {
      user_id: ctx.params.user_id,
      start_time: new Date(body.start_time).getTime(),
    }

    const res = await knex('companion_class_schedule').where(filter).update({
      status: 'cancelled',
    })

    if (res === 1) {
      ctx.body = (await knex('companion_class_schedule')
        .where(filter)
        .select('user_id', 'status'))[0]
    } else {
      throw new Error(res)
    }
  } catch (ex) {
    console.error(ex)
    ctx.throw(500, ex)
  }
}

module.exports = { listAll, list, create, cancel }
