const logFormat = require("@src/utils/log_format");

const logger = () => {
  return async (ctx, next) => {
    const start = new Date(); //开始时间
    let ms; //间隔时间
    try {
      await next(); // 下一个中间件
      ms = new Date() - start;
      logFormat.response(ctx, `${ms}ms`); //记录响应日志
    } catch (error) {
      ms = new Date() - start;
      logFormat.error(ctx, error, `${ms}ms`); //记录异常日志
      throw new Error(error); // 抛出错误让catchError中间件捕获
    }
  };
};

module.exports = logger;
