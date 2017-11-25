'use strict';
// 引入数据库操作db对象
const db = require('../models/db');
// 空对象用于导出数据
let userController = {};

/**
 * [检查用户是否存在]
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
userController.checkUser = (req, res, next) => {
  // 获取请求体的参数
  let username = req.body.username;
  // 根据获取的参数从数据库中查找
  db.query('select * from users where username = ?', [username], (err, data) => {
    // 处理查询数据时发生的异常
    if (err) return next(err);
    // 如果有数据得到的数据 是一个数组对象 判断数组的length是否为0
    if (data.length == 0) {
      // 为0 表示数据库中没有这个数据 可以注册
      res.json({
        code: '001',
        msg: '可以注册'
      })
    } else {
      // 不为0 表示数据库中有这条数据 不可以注册
      res.json({
        code: '002',
        msg: "用户名已经存在"
      })
    }
  })
};

/**
 * [注册]
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
userController.doRegister = (req, res, next) => {
  // 接收数据
  let userData = req.body;
  let username = userData.username;
  let password = userData.password;
  let v_code = userData.v_code;
  let email = userData.email;
  // 处理验证
  let regex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
  // 判断是否满足设置的正则表达式邮箱格式
  if (!regex.test(email)) {
    res.json({
      code: '004',
      msg: '邮箱格式不正确'
    });
    return;
  };
  // 验证用户名或者邮箱是否存在
  db.query('select * from users where username = ? or email = ?', [username, email], (err, data) => {
    if (err) return next(err);
    if (data.length != 0) {
      // 有可能邮箱存在，有可能用户名存在
      let user = data[0];
      if (user.email == email) {
        // 邮箱存在
        return res.json({
          code: '002',
          masg: '邮箱已经注册'
        });
      } else if (user.username == username) {
        // 用户名存在
        return res.json({
          code: '002',
          msg: '用户名已经注册'
        });
      };
    } else {
      // 用户名和邮箱都不存在，可以注册
      db.query('insert into users (username,password,email) values (?,?,?)', [username, password, email], (err, data) => {
        if (err) return next(err);
        res.json({
          code: '001',
          msg: '注册成功'
        });
      });
    };
  });
};

/**
 * [登陆]
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
userController.doLogin = (req, res, next) => {
  // 接受参数
  let username = req.body.username;
  let password = req.body.password;
  let remember_me = req.body.remember_me;
  // 将用户名作为条件查询
  db.query('select * from users where username = ?', [username], (err, data) => {
    if (err) return next(err);
    // 数据库中没有数据
    if (data.length == 0) {
      return res.json({
        code: '002',
        msg: '用户名或密码不正确'
      });
    };
    // 找到了用户
    let dbUser = data[0];
    if (dbUser.password != password) {
      return res.json({
        code: '002',
        msg: '用户名或密码不正确'
      });
    };
    // 用户名和密码都正确 存储用户数据
    req.session.user = dbUser;
    res.json({
      code: '001',
      msg: '登陆成功'
    });
  });
};

/**
 * [退出登陆]
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
userController.logout = (req, res, next) => {
  // 从session中删除user
  req.session.user = null;
  res.json({
    code: '001',
    msg: '退出成功'
  })
}

/**
 * [显示登陆页]
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
userController.showLogin = (req, res, next) => {
  res.render('login.html');
}

/**
 * [显示注册页]
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
userController.showRegister = (req, res, next) => {
  res.render('register.html');
}
// 向外导出
module.exports = userController;