const Router = require('koa-router');
const router = new Router();
const companionsController = require('../controllers/companionClassScheduleController');
const BASE_URL = `/api/v1/companion-class-schedule`;
router.get(`${BASE_URL}/:user_id`, companionsController.list);

module.exports = router;