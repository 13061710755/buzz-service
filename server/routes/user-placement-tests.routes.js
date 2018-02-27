const Router = require("koa-router");
const router = new Router();
const userPlacementTestsController = require("../controllers/userPlacementTestsController");
const BASE_URL = `/api/v1/user-placement-tests`;
router.get(`${BASE_URL}/:user_id`, userPlacementTestsController.query);
router.put(`${BASE_URL}/:user_id`, userPlacementTestsController.upsert);

module.exports = router;