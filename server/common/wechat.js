const Client = require('co-wechat-oauth')
const API = require('co-wechat-api')

const appId = process.env.buzz_wechat_appid
const appSecret = process.env.buzz_wechat_secret

const api = new API(appId, appSecret,
// async () => JSON.parse(await redis.get(`wechat:api:${auth.appID}`)),
// async token => {
//   await redis.set(`wechat:api:${auth.appID}`, JSON.stringify(token))
// }
)

const client = new Client(appId, appSecret,
// async openid => JSON.parse(await redis.get(`wechat:oauth:${auth.appID}:${openid}`)),
// async (openid, token) => {
//   await redis.set(`wechat:oauth:${auth.appID}:${openid}`, JSON.stringify(token), 'ex', _.get(token, 'expires_in', 7200))
// }
)

module.exports = {
  async getJsConfig(arg) {
    return await api.getJsConfig(arg)
  },
  async getMedia({id}) {
    return await api.getMedia(id)
  }
}
