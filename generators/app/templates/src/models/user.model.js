const dbUtils = require("@src/utils/db-util");

const userModel = {
  /**
   * 数据库创建用户
   * @param  {object} model 用户数据模型
   * @return {object}       mysql执行结果
   */
  async create(model) {
    let result = await dbUtils.insertData("user_info", model);
    return result;
  },

  /**
   * 根据用户名和密码查找用户
   * @param  {object} options 用户名密码对象
   * @return {object|null}         查找结果
   */
  async getOneByUserNameAndPassword(options) {
    let _sql = `
    SELECT * from user_info
      where password="${options.password}" and name="${options.name}"
      limit 1`;
    let result = await dbUtils.query(_sql);
    if (Array.isArray(result) && result.length > 0) {
      result = result[0];
    } else {
      result = null;
    }
    return result;
  },

  /**
   * 查找一个存在用户的数据
   * @param  {obejct} options 查找条件参数
   * @return {object|null}        查找结果
   */
  async getExistOne(options) {
    const _sql = `
      SELECT * from user_info
      where name="${options.name}"
      limit 1
    `;
    let result = await dbUtils.query(_sql);
    if (Array.isArray(result) && result.length > 0) {
      result = result[0];
    } else {
      result = null;
    }
    return result;
  },

  // 用id查找一个用户
  async getUserInfoById(id) {
    let result = await dbUtils.findDataById("user_info", id);
    if (Array.isArray(result) && result.length > 0) {
      result = result[0];
    } else {
      result = null;
    }
    return result;
  },
};

module.exports = userModel;
