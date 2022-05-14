require("module-alias/register");
require("dotenv-safe").config(); // 只需要引入一次
const Koa = require("koa");
const koaBody = require("koa-body");
const MysqlStore = require("koa-mysql-session");
const session = require("koa-session-minimal");
const routerResponse = require("./middleware/response");
const HttpException = require("@src/constant/http-exception");
const catchError = require("@src/middleware/catchError");
const logger = require("@src/middleware/logger");
const errorHandler = require("@src/utils/errorHandler");
const config = require("config");
const { koaSwagger } = require('koa2-swagger-ui');
const swagger = require('./swagger')

global.errs = HttpException;

const routers = require("./routers");

const app = new Koa();

// 错误捕获
app.use(catchError);

// 日志
app.use(logger());

app.on("error", errorHandler);

// session存储配置
const sessionMysqlConfig = {
  user: config.Database.USERNAME,
  password: config.Database.PASSWORD,
  database: config.Database.DATABASE,
  host: config.Database.HOST,
};

// 配置session中间件
app.use(
  session({
    key: "USER_SID",
    store: new MysqlStore(sessionMysqlConfig),
  })
);

// 返回信息
app.use(
  routerResponse({
    type: "json",
    successCode: 200,
    failCode: -200,
    successMsg: "请求成功",
    failMsg: "请求失败",
  })
);

// 支持formData接收
app.use(koaBody({ multipart: true, json: true}));

app.use(routers.routes()).use(routers.allowedMethods());
// swagger
app.use(swagger.routes()).use(swagger.allowedMethods())
app.use(
  koaSwagger({
    routePrefix: '/', // 这里配置swagger的访问路径
    swaggerOptions: {
      url: '/swagger.json', // 这里配置swagger的文档配置URL，也就是说，我们展示的API都是通过这个接口生成的。
    },
  }),
);

// app.listen(config.port)
module.exports = app;
