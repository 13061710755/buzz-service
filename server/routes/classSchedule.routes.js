const Router = require("koa-router");
const router = new Router();
const classScheduleController = require("../controllers/classScheduleController");
const BASE_URL = `/api/v1/class-schedule`;
router.get(`${BASE_URL}/suggested-classes`, classScheduleController.listSuggested);
router.get(`${BASE_URL}`, classScheduleController.list);
router.get(`${BASE_URL}/:class_id`, classScheduleController.getClassByClassId);
router.post(`${BASE_URL}`, classScheduleController.upsert);

module.exports = router;