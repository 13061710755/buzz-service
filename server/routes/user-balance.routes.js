const Router = require("koa-router");
const router = new Router();
const usersController = require("../controllers/userBalanceController");
const BASE_URL = `/api/v1/user-balance`;
router.put(`${BASE_URL}/:user_id`, usersController.charge);
router.del(`${BASE_URL}/:user_id`, usersController.consume);

module.exports = router;