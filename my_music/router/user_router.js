'use strict';
const express = require('express');
const userController = require('../controllers/userController');
// 配置路由规则
let router = express.Router();
// 显示登陆页
router.get('/login',userController.showLogin)
// 显示注册页
.get('/register',userController.showRegister)
// 验证码
.get('/get-pic',userController.getCaptcha)

module.exports = router;