/****************************
 * 名称：服务器
 * 功能：后台管理系统
 ****************************/

/**
 * 导入需要的第三方模块
 **/
var express 	 = require('express');
var http 		 = require('http');
var bodyParser   = require('body-parser');
var path     	 = require("path");
var fs       	 = require("fs");
var multer  	 = require('multer');
var session		 = require('express-session');  
var RedisStore   = require('connect-redis')(session);

/**
 * 获取配置信息
 **/
global.config    = require('./config').configInfo;


/**
 * 创建公共全局变量
 **/
global.log4js	   		  = require('log4js');
global.async     		  = require('async');
global.APIConfig 		  = require('./api/api');
global.RES  	   		  = require('./lib/response');
global.R  	    		  = require('./lib/request');
global.MESSAGE   		  = require('./message/message');
global.common    		  = require('./lib/commonFunc');
global.V   				  = require('./lib/verification');
global.regexpRule         = require("./lib/regexpConfig").regexpRule;
global.redis   			  = require("redis");
global.request    		  = require('request');
global.db                 = require('./lib/db');
global.mongoose 		  = require('mongoose');

//初始化融云SDK操作对象
global.rongcloudSDK       = require( 'rongcloud-sdk');
rongcloudSDK.init(config.rongCloudConfig.app_key,config.rongCloudConfig.app_secret);

/**
 * 配置日志信息
 **/
log4js.configure({
	appenders : config.log4.appenders
});

/**
 * 创建redis操作对象
 **/
var Redis = require("./lib/redisClass");
var redis = new Redis();

//连接redis数据库
global.redisClient = redis.connectRedis(config.redisConfig);


/**
 * 创建缓存操作对象
 **/
var Cache	= require('./lib/cacheClass');
global.cache = new Cache();


/**
 * 创建局部工具变量
 **/
var urlFilter = require("./lib/urlFilter");
var urlParse  = require("./lib/urlParse");

/**
 * 生成http服务对象
 **/
global.app = express();

/**
 * 连接mongodb
 **/
require("./lib/mongoose")();


/**
 * 加载中间件部分
 **/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
	name : "sid",
	secret : '-musicScore-',
	resave : true,
	rolling:true,
	saveUninitialized : false,
	cookie : {
		"maxAge" : 1800000
	},
	store : new RedisStore({
		"host" : "127.0.0.1",
		"port" : "6379",
		"pass" : "",
		"db" : 6,
		"ttl" : 1800,
		"logErrors" : true
	})
}));

/**
 * 模版引擎设置为 ejs
 **/
app.set("view engine","ejs");
app.set('views', path.join(__dirname, './public/views'));

//设置上传相关
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		//保存的路径，备注：需要自己创建
		cb(null, './public/temp');
	},
	filename: function (req, file, cb) {

		//保存文件后缀
		var extname = path.extname(file.originalname);

		// 将保存文件名设置为 文件名 + 时间戳
		cb(null, file.fieldname + '-' + Date.now() + extname);

	}
});

//将上传对象保存为全局方法
global.upload = multer({ storage : storage });

/**
 * 初始化融云
 **/
global.rongcloudSDK = require('rongcloud-sdk');
rongcloudSDK.init(config.rongCloudConfig.app_key,config.rongCloudConfig.app_secret);

/**
 * 创建公共函数库
 **/
require("./lib/localsFun");

/**
 * 首页界面
 **/
var indexRoute = require('./index/index');
app.use('/index', indexRoute);


/**
 * URL检测
 **/
app.all("*",function(req,res,next){
	  urlFilter['Url'](req,res,next);
});

/**
 * ec_web_api接口路由部分
 * urlParse.APIisExist  		  : 查看该接口是否存在
 * urlParse.APIisMethod  		  : 查看该接口请求方式是否正确
 * urlParse.APIgetParams 		  : 解析接口参数信息
 * urlParse.APIParamsVerification : 参数格式验证
 * cache.getMemoryCache			  : 获取内存缓存信息
 **/
app.all(["/:firstMenuLevel/:secondMenuLevel/*","/:firstMenuLevel/:secondMenuLevel"],
		urlParse.APIisExist,
		urlParse.APIisMethod,
		urlParse.APIgetParams,
		urlParse.APIParamsVerification,
		cache.getMemoryCache,
		function(req,res) {

			//获取请求路由
			var route = require("./routes" + req.routeInfo.apiFullName);

			//执行接口处理方法
			route[req.routeInfo.secondMenuLevelName](req,res);
		
});

app.all('*', function(req, res){
	res.end('该接口不存在，请重新确认');
});


/**
 * 启动服务器
 **/
if(config.base.isClusterStart){  //判断是否以集群方式启动

	//导入群集处理模块
	var cluster 	 = require('cluster');
	var os 			 = require('os');

	//获取 CPU 的数量
	var cpuCount = os.cpus().length;

	//声明工作进程池
	var workers = {};


	if(cluster.isMaster) {

		//当一个工作进程结束时，重启工作进程
		cluster.on('death', function (worker) {
			delete workers[worker.pid];
			worker = cluster.fork();
			workers[worker.pid] = worker;
		});

		// 声明工作进程
		var worker;

		// 开启与 CPU 数量相同的工作进程
		for (var i = 0; i < cpuCount; i++) {
			worker = cluster.fork();
			workers[worker.pid] = worker;
		}

	}else{

		//启动服务器
		http.createServer(app).listen(config.server.port, function(){
			console.log('服务器正常启动...端口号:' + config.server.port);
		});

	}

	// 当主进程被终止时，关闭所有工作进程
	process.on('SIGTERM', function () {
		for (var pid in workers) {
			if (!workers.hasOwnProperty(pid)) {
				continue;
			}
			process.kill(pid);
		}
		process.exit(0);
	});

}else{

	//启动服务器
	http.createServer(app).listen(config.server.port, function(){
		console.log('服务器正常启动...端口号:' + config.server.port);
	});

}