function routerResponse(option = {}) {
  return async function (ctx, next) {
    ctx.success = function (data, msg) {
      ctx.type = option.type || "json";
      ctx.body = {
        code: option.successCode || 0,
        message: msg || option.successMsg || success,
        data: data,
      };
    };

    ctx.fail = function (msg, code) {
      ctx.type = option.type || "json";
      ctx.body = {
        code: code || option.failCode || 99,
        message: msg || option.failMsg || "fail",
      };
    };

    await next();
  };
}

module.exports = routerResponse;
