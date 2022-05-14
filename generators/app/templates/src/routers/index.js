const router = require("koa-router")();
const config = require("config"); // 引入config
const apiPrefix = config.get("Router.apiPrefix");
router.prefix(apiPrefix); // 设置路由前缀

const user = require("./routes/user");
const auth = require("../middleware/auth");

router.use("/user", user.routes(), user.allowedMethods());
module.exports = router;
