const router = require("koa-router")();
const auth = require("@/src/middleware/auth");
const user = require("@src/controllers/user");
module.exports = router
  .post("/login", user.login)
  .post("/register", user.register)
  .get("/getUserInfo", user.getUserInfo)
  .get("/loginOut", user.loginOut)
