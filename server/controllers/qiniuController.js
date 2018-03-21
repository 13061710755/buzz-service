const qiniu = require('../common/qiniu')

const token = async ctx => {
  try {
    ctx.status = 200
    ctx.body = qiniu.getUptoken()
  } catch (error) {
    console.error('getQiniuUptoken error: ', error)
    ctx.status = 500
    ctx.body = error
  }
}

module.exports = {
  token,
}
