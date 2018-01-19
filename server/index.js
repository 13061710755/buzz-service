const Koa = require("koa");
const articlesRoutes = require("./routes/articles.routes");
const usersRoutes = require("./routes/users.routes");
const monitorsRoutes = require('./routes/monitors.routes');
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const PORT = process.env.PORT || 16888;
app.use(bodyParser());
app.use(articlesRoutes.routes());
app.use(usersRoutes.routes());
app.use(monitorsRoutes.routes());
const server = app.listen(PORT).on("error", err => {
    console.error(err);
});
module.exports = server;