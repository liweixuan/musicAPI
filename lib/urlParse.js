/****************************
 * URL解析
 ****************************/

(function () {

	//URL解析结果
	var routeInfo = {};

	/**
	 * 查看该接口是否存在
	 **/
	exports.APIisExist = function (req, res, next) {

		//获取一级菜单名
		var firstMenuLevelName = req.params.firstMenuLevel;

		//获取二级菜单名称
		var secondMenuLevelName = req.params.secondMenuLevel;

		//拼接完整接口地址
		var resultApiName = '/' + firstMenuLevelName + '/' + secondMenuLevelName;

		//查看该接口是否注册(存在)
		if (APIConfig.API[resultApiName] == undefined) {

			//如果该接口不存在
			return RES.response(res, false, MESSAGE.apiError.noRegister);

		}

		//记录一级菜单名
		routeInfo.firstMenuLevelName = firstMenuLevelName;

		//记录二级菜单名
		routeInfo.secondMenuLevelName = secondMenuLevelName;

		//记录接口完整名称
		routeInfo.apiFullName = resultApiName;

		//保存原始URL地址
		routeInfo.reqUrl = req.url;


		next();

	};


	/**
	 * 查看该接口请求方式是否正确
	 **/
	exports.APIisMethod = function (req, res, next) {

		//获取请求方式
		var method = req.method;

		//获取该接口支持的请求方式
		var apiMethod = APIConfig.API[routeInfo.apiFullName].method;

		//判断该接口
		if (apiMethod != 'ALL') {
			if (apiMethod != method) {
				RES.response(res, false, MESSAGE.apiError.noMethod);
			}
		}

		//接口请求方式
		routeInfo.method = method;

		//接口注册请求方式
		routeInfo.apiMethod = apiMethod;

		next();

	};

	/**
	 * 解析接口参数信息
	 **/
	exports.APIgetParams = function (req, res, next) {

		//判断请求方式，获取相应参数
		if (routeInfo.method == 'GET' || routeInfo.method == 'POST') {

			//获取RESTFUL参数
			var restfulParams = req.params[0];

			//解析RESTFUL参数,判断是否存在restful参数
			if (restfulParams != undefined) {

				//获取解析后的restful参数
				resultRestFul = common.parseRestFulParams(restfulParams);
				if (!resultRestFul) {
					RES.response(res, false, MESSAGE.apiError.noRestful);
				}

				//保存最终restful参数

				routeInfo.restfulParams = resultRestFul;

			}else{
                routeInfo.restfulParams = {};
            }

			if (routeInfo.method == 'POST') {

				//保存最终body参数
				routeInfo.bodyParams = req.body;
			}

		} else {
			RES.response(res, false, MESSAGE.apiError.noMethod);
		}

		//向外传递最终结果
		req.routeInfo = routeInfo;

		next();

	};

	/**
	 * 参数信息验证
	 **/
	exports.APIParamsVerification = function (req, res, next) {

		//对必传GET参数进行验证
		var getVerification = APIConfig.API[routeInfo.apiFullName].getMustParams;
		if (getVerification != undefined) {

			//获取需要验证的KEY数组
			var getVerificationKeyArray = common.getJsonKeyArray(getVerification);

			//获取restful参数KEY数组
			var restfulKeyArr = common.getJsonKeyArray(routeInfo.restfulParams);

			//求缺少的参数信息(获取两个数组的差集)
			var noRestFulParamsArr = common.minus(getVerificationKeyArray, restfulKeyArr);

			//缺少参数
			if (noRestFulParamsArr.length > 0) {
				RES.response(res, false, '缺少RESTFUL参数 :' + noRestFulParamsArr.join(","));
			}

			//对GET参数格式进行验证
			for (var k in routeInfo.restfulParams) {

				var key = k;
				var value = routeInfo.restfulParams[k];
				var rule = getVerification[k];

				//获取验证结果
				var errorMessage = V.paramsV(key, value, rule);

				//返回提示信息
				if (errorMessage) {
					RES.response(res, false, errorMessage);
				}
			}
		}

		//对非必传GET参数进行验证
		var getNoMustVerification = APIConfig.API[routeInfo.apiFullName].getNoMustParams;
		if (getNoMustVerification != undefined) {

			//对GET参数格式进行验证
			for (var k in routeInfo.restfulParams) {

				var key = k;
				var value = routeInfo.restfulParams[k];
				var rule = getNoMustVerification[k];

				//获取验证结果
				var errorMessage = V.paramsV(key, value, rule);

				//返回提示信息
				if (errorMessage) {
					RES.response(res, false, errorMessage);
				}
			}
		}


		//对POST参数进行验证
		var postVerification = APIConfig.API[routeInfo.apiFullName].postMustParams;



		if (postVerification != undefined) {

			//获取需要验证的KEY数组
			var postVerificationKeyArray = common.getJsonKeyArray(postVerification);

			//获取restful参数KEY数组
			var postKeyArr = common.getJsonKeyArray(routeInfo.bodyParams);

			//求缺少的参数信息(获取两个数组的差集)
			var noPostParamsArr = common.minus(postVerificationKeyArray, postKeyArr);

			//缺少参数
			if (noPostParamsArr.length > 0) {
				RES.response(res, false, '缺少BODY参数 :' + noPostParamsArr.join(","));
			}

			//对POST参数格式进行验证
			for (var k in routeInfo.bodyParams) {

				var key = k;
				var value = routeInfo.bodyParams[k];
				var rule = postVerification[k];

				//获取验证结果
				var errorMessage = V.paramsV(key, value, rule);

				//返回提示信息
				if (errorMessage) {
					RES.response(res, false, errorMessage);
				}
			}

		}

		//对非必传POST参数进行验证
		var postNoMustVerification = APIConfig.API[routeInfo.apiFullName].postNoMustParams;
		if (postNoMustVerification != undefined) {

			//对GET参数格式进行验证
			for (var k in routeInfo.bodyParams) {

				var key = k;
				var value = routeInfo.bodyParams[k];
				var rule = postNoMustVerification[k];

				//获取验证结果
				var errorMessage = V.paramsV(key, value, rule);

				//返回提示信息
				if (errorMessage) {
					RES.response(res, false, errorMessage);
				}
			}
		}

		next();

	};


}).call(this);