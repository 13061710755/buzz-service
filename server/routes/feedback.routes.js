const Router = require('koa-router');
const router = new Router();
const classFeedbackController = require('../controllers/classFeedbackController');
const BASE_URL = `/api/v1/class-feedback`;
router.get(`${BASE_URL}/:class_id`, classFeedbackController.getFeedbackList);
router.post(`${BASE_URL}/:user_id`, classFeedbackController.setFeedbackInfo);

module.exports = router;