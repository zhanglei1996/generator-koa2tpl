/**
 * 用户业务操作
 */

const userModel = require("../models/user.model");

const user = {
  /**
   * 创建用户
   * @param  {object} user 用户信息
   * @return {object}      创建结果
   */
  async create(user) {
    let result = await userModel.create(user);
    return result;
  },

  /**
   * 登录业务操作
   * @param  {object} formData 登录表单信息
   * @return {object}          登录业务操作结果
   */
  async signIn(formData) {
    let resultData = await userModel.getOneByUserNameAndPassword({
      password: formData.password,
      name: formData.name,
    });
    return resultData;
  },

  /**
   * 检验用户注册数据
   * @param  {object} userInfo 用户注册数据
   * @return {object}          校验结果
   */
  validatorSignUp(userInfo) {
    let result = {
      success: false,
      message: "",
    };

    if (/[a-z0-9\_\-]{6,16}/.test(userInfo.userName) === false) {
      result.message = userCode.ERROR_USER_NAME;
      return result;
    }
    if (!validator.isEmail(userInfo.email)) {
      result.message = userCode.ERROR_EMAIL;
      return result;
    }
    if (!/[\w+]{6,16}/.test(userInfo.password)) {
      result.message = userCode.ERROR_PASSWORD;
      return result;
    }
    if (userInfo.password !== userInfo.confirmPassword) {
      result.message = userCode.ERROR_PASSWORD_CONFORM;
      return result;
    }

    result.success = true;

    return result;
  },

  /**
   * 查找存在的用户信息
   * @param  {object} formData 查找的表单数据
   * @return {object|null}      查找结果
   */
  async getExistOne (formData) {
    const resultData = await userModel.getExistOne({
      'name': formData.name
    })
    return resultData
  }
};

module.exports = user;
