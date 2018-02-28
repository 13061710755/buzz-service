const Router = require('koa-router');
const router = new Router();
const placementTestController = require('../controllers/placementTestController');
const BASE_URL = `/api/v1/placement-test`;
router.get(`${BASE_URL}/`, placementTestController.getPlacementTest);
router.post(`${BASE_URL}/:uesr_id`, placementTestController.savePlacementTest);

module.exports = router;