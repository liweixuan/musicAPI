/****************************
 * URL过滤
 ****************************/

(function () {

	/**
	 * URL检测
	 **/
	exports.Url = function (req, res, next) {

		var method = req.method;
		console.log("请求方式 : " + method);
		//判断请求类型
		if (method !== 'GET' && method !== 'POST' && method !== 'OPTIONS') {
			var result = {success: false, message: '非法请求方式'};
			res.send(result);
		} else {
			//判断是否开启了跨域
			if(config.base.isCrossOrigin){

				res.header("Access-Control-Allow-Origin", "*");
				res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Accept,X-Requested-With,x-token");
				res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");

			}

			next();
		}
	};

}).call(this);