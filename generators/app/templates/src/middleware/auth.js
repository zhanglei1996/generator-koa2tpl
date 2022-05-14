// 需要登录权限的路由都要经过这个中间件
const auth = (options) => {
  const { needNotUrl = [] } = options || {}
  return async function (ctx, next) {
    if (needNotUrl.includes(ctx.url)) {
      await next();
      return;
    }
    if (ctx.session && ctx.session.isLogin) {
      await next();
      return;
    } else {
      ctx.fail("没有权限", 401);
    }
  };
};

module.exports = auth;
