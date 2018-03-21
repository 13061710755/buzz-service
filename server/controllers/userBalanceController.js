const promisify = require('../common/promisify')
const env = process.env.NODE_ENV || 'test'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)
const classHoursBll = require('../bll/class-hours')

const charge = async ctx => {
    const { body } = ctx.request

    const classHours = Number(body.class_hours)
    if (Number.isNaN(classHours) || classHours <= 0) {
        ctx.throw(400, 'class_hours should be a positive number!')
    }

    const trx = await promisify(knex.transaction)

    try {
        const userId = ctx.params.user_id
        await classHoursBll.charge(trx, userId, classHours)

        await trx.commit()

        ctx.status = 201
        ctx.set('Location', `${ctx.request.URL}`)
        ctx.body = (await knex('user_balance').select('class_hours').where({ user_id: userId }))[0]
    } catch (error) {
        console.error(error)

        await trx.rollback()
        ctx.status = 500
        ctx.body = {
            error: 'Charge failed!',
        }
    }
}

const consume = async ctx => {
    const { body } = ctx.request

    const classHours = Number(body.class_hours)
    if (Number.isNaN(classHours) || classHours <= 0) {
        ctx.throw(400, 'class_hours should be a positive number!')
    }

    const trx = await promisify(knex.transaction)

    try {
        const userId = ctx.params.user_id
        await classHoursBll.consume(trx, userId, classHours)
        await trx.commit()

        ctx.status = 201
        ctx.set('Location', `${ctx.request.URL}`)
        ctx.body = (await knex('user_balance').select('class_hours').where({ user_id: userId }))[0]
    } catch (error) {
        console.error(error)

        await trx.rollback()
        ctx.status = 500
        ctx.body = { error: 'Consume failed!' }
    }
}

module.exports = { charge, consume }
