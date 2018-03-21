const Router = require('koa-router')
const router = new Router()
const qiniuController = require('../controllers/qiniuController')
const BASE_URL = '/api/v1/qiniu'
router.get(`${BASE_URL}/token`, qiniuController.token)

module.exports = router
