'use strict';
// 引入express对象
const express = require('express');
const userController = require('../controllers/userController');
const musicController = require('../controllers/musicController');

// 配置路由规则 开始

let router = express.Router();
// 处理注册用户
router.post('/check-user', userController.checkUser)
  // 注册用户
  .post('/do-register', userController.doRegister)
  // 用户登陆
  .post('/do-login', userController.doLogin)
  // 退出登陆
  .get('/logout', userController.logout)
  // 添加音乐
  .post('/add-music', musicController.addMusic)
  // 更新音乐
  .put('/update-music', musicController.updateMusic)
  // 删除音乐
  .delete('/del-music',musicController.delMusic)
  

// 配置路由规则 结束

// 向外导出
module.exports = router;