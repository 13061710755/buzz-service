const env = process.env.NODE_ENV || 'test'
const config = require('../../knexfile')[env]
const knex = require('knex')(config)
const healthCheck = async ctx => {
  ctx.body = {
    everything: 'is ok',
    env,
  }
}
module.exports = { healthCheck }
