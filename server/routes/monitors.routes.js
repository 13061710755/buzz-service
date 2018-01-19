const Router = require("koa-router");
const router = new Router();
const monitorsControllers = require("../controllers/monitorsController");
const BASE_URL = `/api/v1/monitors`;
router.get(`${BASE_URL}/health-check`, monitorsControllers.healthCheck);

module.exports = router;