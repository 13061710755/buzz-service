const Koa = require("koa");
const usersRoutes = require("./routes/users.routes");
const studentClassSchedule = require('./routes/studentClassSchedule.routes');
const companionClassSchedule = require('./routes/companionClassSchedule.routes');
const classSchedule = require('./routes/classSchedule.routes');
const monitorsRoutes = require('./routes/monitors.routes');
const feedbackRoutes = require('./routes/feedback.routes');
<<<<<<< HEAD
const placementTestRoutes = require('./routes/placementTest.routes');
=======
const userBalanceRoutes = require('./routes/user-balance.routes');
const userPlacementTestsRoutes = require('./routes/user-placement-tests.routes');
>>>>>>> 2e499bb88389e41a05750e15292c11d63fd02913
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const PORT = process.env.PORT || 16888;
app.use(bodyParser());
app.use(usersRoutes.routes());
app.use(studentClassSchedule.routes());
app.use(companionClassSchedule.routes());
app.use(feedbackRoutes.routes());
app.use(placementTestRoutes.routes());
app.use(classSchedule.routes());
app.use(monitorsRoutes.routes());
app.use(userBalanceRoutes.routes());
app.use(userPlacementTestsRoutes.routes());
const server = app.listen(PORT).on("error", err => {
    console.error(err);
});
module.exports = server;