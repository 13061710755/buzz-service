const Router = require('koa-router');
const router = new Router();
const companionClassScheduleController = require('../controllers/companionClassScheduleController');
const BASE_URL = `/api/v1/companion-class-schedule`;
router.get(`${BASE_URL}`, companionClassScheduleController.listAll);
router.get(`${BASE_URL}/:user_id`, companionClassScheduleController.list);
router.post(`${BASE_URL}/:user_id`, companionClassScheduleController.create);
router.put(`${BASE_URL}/:user_id`, companionClassScheduleController.cancel);

module.exports = router;