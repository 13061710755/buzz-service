const Router = require("koa-router");
const router = new Router();
const classScheduleController = require("../controllers/classScheduleController");
const BASE_URL = `/api/v1/class-schedule`;
router.get(`${BASE_URL}/suggested-classes`, classScheduleController.listSuggested);

module.exports = router;