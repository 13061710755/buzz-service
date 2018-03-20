const fs = require('fs')
const os = require('os')
const path = require('path')
const Client = require('co-wechat-oauth')
const API = require('co-wechat-api')

const appId = process.env.buzz_wechat_appid
const appSecret = process.env.buzz_wechat_secret

// TODO: redis
const apiFile = path.join(os.tmpdir(), `wechat_api_${appId}.txt`)
const api = new API(
  appId, appSecret,
  async () => {
    try {
      JSON.parse(fs.readFileSync(apiFile, 'utf8'))
    } catch (e) {}
  },
  async token => fs.writeFileSync(apiFile, JSON.stringify(token))
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
