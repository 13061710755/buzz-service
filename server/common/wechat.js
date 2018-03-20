const Client = require('co-wechat-oauth')
const API = require('co-wechat-api')

const appId = process.env.buzz_wechat_appid
const appSecret = process.env.buzz_wechat_secret

const api = new API(appId, appSecret)

const client = new Client(appId, appSecret)

module.exports = {
  async getJsConfig(arg) {
    return await api.getJsConfig(arg)
  },
  async getMedia({ id }) {
    return await api.getMedia(id)
  },
}
