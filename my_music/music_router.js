'use strict';
// 引入express
const express = require('express');
const musicController = require('./controllers/musicController');
// 配置路由规则
let router = express.Router();
router.get('/add-music',musicController.showAddmusic)
.get('/list-music',musicController.showListMusic);

module.exports = router;