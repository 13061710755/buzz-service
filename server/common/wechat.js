const fs = require('fs')
const os = require('os')
const path = require('path')
const Client = require('co-wechat-oauth')
const API = require('co-wechat-api')
const { redis } = require('./redis')

const appId = process.env.buzz_wechat_appid
const appSecret = process.env.buzz_wechat_secret

const apiName = `wechat:api:${appId}`
const api = new API(
    appId, appSecret,
    async () => JSON.parse(await redis.get(apiName)),
    async token => {
        await redis.set(apiName, JSON.stringify(token))
    }
)
const client = new Client(appId, appSecret)

module.exports = {
    async getJsConfig(arg) {
        return await api.getJsConfig(arg)
    },
    async getMedia({ serverId }) {
        return await api.getMedia(serverId)
    },
}
