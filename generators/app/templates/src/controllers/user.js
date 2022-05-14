const userInfoService = require("@src/services/user");
const { jsonParser } = require("config/parser");
const userCode = require("../codes/user");
const userModel = require('@src/models/user.model')

/**
 * @swagger
 * /user/login:
 *    post:
 *      tags:
 *      - user
 *      summary: 系统登录
 *      consumes:
 *        - application/json
 *      parameters:
 *      - name: loginParams
 *        in: body
 *        description: 系统登录参数
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - password
 *          properties:
 *            obj:
 *              type: object
 *              required:
 *                - account
 *                - name
 *                - phone
 *                - roleId
 *                - state
 *              description: 新增数据对象
 *              properties:
 *                name:
 *                  type: string
 *                  description: 管理员姓名
 *                account:
 *                  type: string
 *                  description: 管理员账号
 *                state:
 *                  type: integer
 *                  description: 账号状态
 *                phone:
 *                  type: string
 *                  description: 管理员联系方式
 *                roleId:
 *                  type: integer
 *                  description: 管理员角色编码
 *            name:
 *              type: string
 *              description: 用户账号
 *            password:
 *              type: string
 *              description: 密码
 *      responses:
 *        200:
 *          description: successful operation
 *
 * /user/register:
 *    post:
 *      tags:
 *      - user
 *      summary: 用户注册
 *      consumes:
 *        - application/json
 *      parameters:
 *      - name: registerParams
 *        in: body
 *        description: 用户登录参数
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - password
 *          properties:
 *            name:
 *              type: string
 *              description: 用户账号
 *            password:
 *              type: string
 *              description: 密码
 *      responses:
 *        200:
 *          description: successful operation
 * */

module.exports = {
  // 用户登录
  login: async (ctx) => {
    const formData = ctx.request.body || {};

    const { name, password } = formData;

    if (!name || !password) {
      return ctx.fail("请输入用户名或密码");
    }

    const userResult = await userInfoService.signIn(formData);

    if (userResult) {
      // 设置session
      const session = ctx.session;
      session.isLogin = true;
      session.userName = userResult.name;
      session.userId = userResult.id;
      return ctx.success(userResult);
    } else {
      return ctx.fail(userCode.FAIL_USER_NAME_OR_PASSWORD_ERROR);
    }
  },

  // 用户注册
  register: async (ctx) => {
    const formData = ctx.request.body || {};

    const { name, password } = formData;
    if (!name || !password) {
      return ctx.fail("请输入用户名或密码");
    }

    const existOne = await userInfoService.getExistOne(formData)

    if(existOne) {
      return ctx.fail('用户名已被注册')
    }

    const userResult = await userInfoService.create({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      create_time: new Date().getTime(),
      level: 1,
    })

    if ( userResult && userResult.insertId * 1 > 0) {
      return ctx.success('注册成功');
    } else {
      return ctx.fail('注册失败');
    }

    
  },

  /**
   * @swagger
   * /user/getUserInfo:
   *    get:
   *      tags:
   *      - user
   *      summary: 获取用户信息
   *      responses:
   *        200:
   *          description: successful operation
   */
  getUserInfo: async (ctx) => {
    const session = ctx.session;
    const { userId } = session || {}
    if(!userId) {
      ctx.status = 401
      return ctx.fail("没有权限", 401);
    }
    const { password, ...result } = await userModel.getUserInfoById(userId)
    if(result) {
      return ctx.success(result);
    }else {
      return null
    }
  },

  /**
   * @swagger
   * /user/loginOut:
   *    get:
   *      tags:
   *      - user
   *      summary: 退出登录
   *      responses:
   *        200:
   *          description: successful operation
   */
  loginOut: async (ctx) => {
    const session = ctx.session;
    session.isLogin = false;
    session.userId = undefined;
    session.userName = undefined;
    ctx.success("退出登录");
  },
};
