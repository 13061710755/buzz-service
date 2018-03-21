const promisify = require('../common/promisify')
const env = process.env.NODE_ENV || 'test'
const config = require('../../knexfile')[env]
console.log('knex config = ', config)
const knex = require('knex')(config)
const wechat = require('../common/wechat')
const Stream = require('stream')
const qiniu = require('../common/qiniu')

const getJsConfig = async ctx => {
  try {
    const jsConfig = await wechat.getJsConfig(ctx.request.body)
    ctx.status = 200
    ctx.body = { jsConfig }
  } catch (error) {
    console.error('getWechatJsConfig error: ', error)
    ctx.status = 500
    ctx.body = error
  }
}
const media = async ctx => {
  try {
    const buffer = await wechat.getMedia(ctx.request.body)
    const stream = new Stream.PassThrough()
    stream.end(buffer)
    const { key, url: { resources_url }, suffix: { avvod } } = await qiniu.uploadStream(stream)
    const url = `${resources_url}${key}?${avvod}`
    ctx.status = 200
    ctx.body = { url }
  } catch (error) {
    console.error('getWechatJsConfig error: ', error)
    ctx.status = 500
    ctx.body = error
  }
}
module.exports = {
  getJsConfig,
  media,
}
