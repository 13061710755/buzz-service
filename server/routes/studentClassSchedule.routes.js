const Router = require("koa-router");
const router = new Router();
const usersController = require("../controllers/studentClassScheduleController");
const BASE_URL = `/api/v1/student-class-schedule`;
router.get(`${BASE_URL}/:user_id`, usersController.list);

module.exports = router;