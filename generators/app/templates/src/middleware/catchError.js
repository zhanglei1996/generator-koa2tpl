const catchError = async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      // 只是一个抛出自定义特定错误的示例
      throw new errs.NotFound();
    }
  } catch (err) {
    if (err.errorCode) {
      // 如果是自己主动抛出的 HttpException类 错误
      ctx.status = err.status || 500;
      ctx.body = {
        code: err.code,
        message: err.message,
        errorCode: err.errorCode,
        request: `${ctx.method} ${ctx.path}`,
      };
    } else {
      // 触发 koa app.on('error') 错误监听事件，可以打印出详细的错误堆栈 log
      ctx.app.emit("error", err, ctx);
    }
  }
};

module.exports = catchError;
