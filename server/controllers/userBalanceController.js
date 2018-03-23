const promisify = require('../common/promisify')
const env = process.env.NODE_ENV || 'test'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)
const classHoursBll = require('../bll/class-hours')
const integralBll = require('../bll/integral')

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

const consumeIntegral = async ctx => {
    const { body } = ctx.request

    const integral = Number(body.integral)
    if(Number.isNaN(integral) || integral <= 0){
        ctx.throw(400, 'integer should be a positive number!')
    }

    const trx = await promisify(knex.transaction)

    try {
        const userId = ctx.params.user_id
        await integralBll.consume(trx, userId, integral)
        await trx.commit()

        ctx.status = 201
        ctx.set('Location', `${ctx.request.URL}`)
        ctx.body = (await knex('user_balance').select('integral').where({ user_id: userId }))[0]
        console.log(ctx.body)
    }catch (error){
        console.log(error)

        await trx.rollback()
        ctx.status = 500
        ctx.body = { error: 'Consume failed!'}
    }
}

const chargeIntegral = async ctx => {
    const { body } = ctx.request

    const integral = Number(body.integral)
    if (Number.isNaN(integral) || integral <= 0) {
        ctx.throw(400, 'integral should be a positive number!')
    }

    const trx = await promisify(knex.transaction)

    try {
        const userId = ctx.params.user_id
        await integralBll.charge(trx, userId, integral)

        await trx.commit()

        ctx.status = 201
        ctx.set('Location', `${ctx.request.URL}`)
        ctx.body = (await knex('user_balance').select('integral').where({ user_id: userId }))[0]
        console.log(ctx.body)
    } catch (error) {
        console.error(error)

        await trx.rollback()
        ctx.status = 500
        ctx.body = {
            error: 'Charge failed!',
        }
    }
}

module.exports = { charge, consume, chargeIntegral, consumeIntegral }
