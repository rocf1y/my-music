'use strict';
// 引入数据库操作db对象
const db = require('../models/db');
// 解析文件上传
const formidable = require('formidable');
// 引入path核心对象
const path = require('path');
//引入配置对象
const config = require('../config');
/**
 * [添加音乐]
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.addMusic = (req, res, next) => {
  // 解析文件上传对象
  var form = new formidable.IncomingForm();
  // 默认上传文件保存路径
  form.uploadDir = path.join(config.rootPath, 'public/files');
  form.parse(req, function (err, fields, files) {
    if (err) return next(err);
    // 先获取提交的title singer time
    let datas = [fields.title, fields.singer, fields.time];
    let sql = 'insert into musics (title,singer,time,';
    let params = '(?,?,?';
    // 如果上传了歌曲文件
    if (files.file) {
      // 获取文件的名称
      let filename = path.parse(files.file.path).base;
      // 文件路径添加到数组中
      datas.push('/public/files/' + filename);
      sql += 'file,';
      params += ',?';
    };
    // 如果上传了歌词文件
    if (files.filelrc) {
      // 获取文件的名称
      let lrcname = path.parse(files.filelrc.path).base;
      // 文件路径添加到数组中
      datas.push('/public/files/' + lrcname);
      sql += 'filelrc,';
      params += ',?';
    };
    params += ',?)';
    sql += 'uid) values ';
    // 用户的id
    datas.push(req.session.user.id);
    // 信息添加到数据库中
    db.query(sql + params, datas, (err, data) => {
      res.json({
        code: '001',
        msg: '添加音乐成功'
      });
    });
  });
};

/**
 * [更新音乐]
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.updateMusic = (req, res, next) => {
  // 解析文件上传对象
  var form = new formidable.IncomingForm();
  // 默认上传文件保存路径
  form.uploadDir = path.join(config.rootPath, '/public/files');
  form.parse(req, function (err, fields, files) {
    if (err) return next(err);
    // 先获取提交的title singer time
    let datas = [fields.title, fields.singer, fields.time];
    let sql = 'update musics set title=?,singer=?,time=?';
    // 如果上传了歌曲文件
    if (files.file) {
      // 获取文件的名称
      let filename = path.parse(files.file.path).base;
      // 文件路径添加到数组中
      datas.push('/public/files/' + filename);
      sql += ',file=?';
    };
    // 如果上传了歌词文件
    if (files.filelrc) {
      // 获取文件的名称
      let lrcname = path.parse(files.filelrc.path).base;
      // 文件路径添加到数组中
      datas.push('/public/files/' + lrcname);
      sql += ',filelrc=?';
    };
    sql += ' where id = ?';
    datas.push(fields.id);
    // 更新指定的数据
    db.query(sql, datas, (err, data) => {
      res.json({
        code: '001',
        msg: '更新音乐成功'
      });
    });
  });
};

/**
 * [删除音乐]
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.delMusic = (req, res, next) => {
  // 获取用户的id
  let userId = req.session.user.id;
  // 接收参数
  let musicId = req.body.id;
  // 连接数据库进行删除操作
  db.query('delete from musics where id = ? and uid = ?', [musicId, userId], (err, result) => {
    if (err) return next(err);
    // 判断删除是否成功
    if (result.affectedRows == 0) {
      return res.json({
        code: '002',
        msg: '歌曲不存在'
      })
    }
    res.json({
      code: '001',
      msg: '删除成功'
    })
  })
}

/**
 * [添加音乐页]
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.showAddmusic = (req, res, next) => {
  res.render('add.html');
}

/**
 * [显示音乐列表页面]
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.showListMusic = (req, res, next) => {
  // 获取用户的id
  let userId = req.session.user.id;
  // 以用户id为查询条件从数据库中查询对应的数据
  db.query('select * from musics where uid = ?', [userId], (err, data) => {
    if (err) return next(err);
    res.render('list.html',{
      data,
    })
  })
}