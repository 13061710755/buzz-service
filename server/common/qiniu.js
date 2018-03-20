const qiniu = require('qiniu')
const config_qiniu = {
  ACCESS_KEY: process.env.buzz_qiniu_access_key,
  SECRET_KEY: process.env.buzz_qiniu_secret_key,
  bucket: 'buzz-corner-user-resource',
  url: {
    upload_url: 'http://upload.qiniu.com/',
    resources_url: 'http://p57969ygc.bkt.clouddn.com/',
  },
}
const mac = new qiniu.auth.digest.Mac(config_qiniu.ACCESS_KEY, config_qiniu.SECRET_KEY)
const putPolicy = new qiniu.rs.PutPolicy({
  scope: config_qiniu.bucket,
})

module.exports = {
  getUptoken() {
    return {
      uptoken: putPolicy.uploadToken(mac) || '',
      upload_url: config_qiniu.url.upload_url,
      resources_url: config_qiniu.url.resources_url,
    }
  },
}
