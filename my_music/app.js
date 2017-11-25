'use strict';
//引入配置对象
const config = require('./config');
// 引入express对象
const express = require('express');
// 创建服务器
let app = express();
// 开启服务器监听端口
app.listen(config.web_port, config.web_host, () => {
	console.log('端口' + config.web_port + '服务器启动了');
});
// 引入处理post请求体对象
const bodyParser = require('body-parser');
// 引入session
const session = require('express-session');
// 引入路由
const api_router = require('./web_router');
const user_router = require('./user_router');
const music_router = require('./music_router');
// 配置模板引擎
app.engine('html', require('express-art-template'));
// 处理静态资源
app.use('/public', express.static('./public'));
// 在路由使用session之前，先生产session
app.use(session({
	secret: 'itcast', //唯一标识，必填
	resave: false,
	//true强制保存,不管有没有改动session中的数据，依然重新覆盖一次
	saveUninitialized: true, //一访问服务器就分配session
	//如果为false,当你用代码显式操作session的时候才分配
	// cookie: { secure: true // 仅仅在https下使用 }
}));

// 处理post请求体数据
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}));
// parse application/json
app.use(bodyParser.json());
// 判断用户是否登陆，登陆了才让执行后续操作
app.use(/\/music|\/api\/.*music/, (req, res, next) => {
	// 判断是否存在session上的user
	if (!req.session.user) {
		return res.send(`
      你还没有登陆呦.....
      <a href="/user/login">点击跳转登陆页面</a>
    `);
	};
	next();
});
//传递一个值给art-template
app.use((req, res, next) => {
	//locals所挂载的数据，就是art-template渲染时直接用的
	app.locals.user = req.session.user;
	//放行
	next();
});
// 后台响应路由
app.use('/api', api_router);
// 用户页面路由
app.use('/user', user_router);
// 音乐页面路由 
app.use('/music', music_router);
// 错误处理
app.use((err, req, res, next) => {
	console.log(err);
	res.send(`
        <div style="background-color:yellowgreen;">
            您要访问的页面，暂时去医院了..请稍后再试..
            <a href="/">去首页</a>
        </div>
    `)
});