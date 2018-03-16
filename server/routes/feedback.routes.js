const Router = require('koa-router');
const router = new Router();
const classFeedbackController = require('../controllers/classFeedbackController');
const BASE_URL = `/api/v1/class-feedback`;
router.get(`${BASE_URL}/admin-list`, classFeedbackController.getAdminFeedbackList);
router.get(`${BASE_URL}/:class_id/:from_user_id/evaluate/:to_user_id`, classFeedbackController.getFeedbackList);
router.post(`${BASE_URL}/:class_id/:from_user_id/evaluate/:to_user_id`, classFeedbackController.setFeedbackInfo);

module.exports = router;