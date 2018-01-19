const Router = require("koa-router");
const router = new Router();
const usersController = require("../controllers/usersController");
const BASE_URL = `/api/v1/users`;
router.get(`${BASE_URL}`, usersController.index);
router.get(`${BASE_URL}/:user_id`, usersController.show);
router.post(`${BASE_URL}`, usersController.create);

module.exports = router;