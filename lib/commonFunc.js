/****************************
 * 常用基本－公共函数库
 ****************************/

(function () {

	/**
	 * MD5加密函数
	 **/
	exports.md5 = function (data) {
		var Buffer = require("buffer").Buffer;
		var buf = new Buffer(data);
		var str = buf.toString("binary");
		var crypto = require("crypto");
		return crypto.createHash("md5").update(str).digest("hex");
	};


	/**
	 * 将字符串分割成数组
	 **/
	exports.strTransformArr = function (str) {
		var tmpArr = new Array();
		var tmpStr = str.split(",")[0].split("|");
		for (i in tmpStr) {

			tmpArr.push(tmpStr[i]);
		}
		return tmpArr;
	};


	/**
	 * 将字符串中的内容,匹配数组中的每个内容,如果存在就替换成指定字符
	 **/
	exports.filterStr = function (str, arr, character) {

		var str = str;
		for (var i = 0; i < arr.length; i++) {
			str = str.replace(arr[i], character);
		}
		return str;
	};


	/**
	 * 获取当前的时间
	 * 参数1:如果为true就获取毫秒，为false获取秒
	 **/
	exports.nowTime = function (timeResult) {

		var timeRs;
		if (timeResult) {
			timeRs = new Date().getTime();
		} else {
			timeRs = parseInt(new Date().getTime() / 1000);
		}
		return timeRs;
	};

	/**
	 * 获取6位随机验证码
	 * @returns {string} 验证码
	 */
	exports.getVerificationCode = function () {
		var num = "";
		for (var i = 0; i < 6; i++) {
			num = num + Math.floor(Math.random() * 10);
		}
		return num;
	};

	/**
	 * 解析restful参数
	 */
	exports.parseRestFulParams = function(paramsURL){

		var restFulArr = paramsURL.split("/");

		//判断是否为键值对的格式
		if(restFulArr.length % 2 != 0){
		   return false;
		}

		//将参数记录为JSON形势
		var jsonParams = {};
		if(restFulArr.length > 0){
			for(var i = 0;i<restFulArr.length;i++){

				//判断key是否为数字
				if(!isNaN(restFulArr[i])){
					 return false;
				}

				//保存参数信息
				jsonParams[restFulArr[i]] = restFulArr[i+1];
				i++;
			}
		}

		return jsonParams;

	};

	/**
	 * 将JSON参数组装成RESTFUL格式
	 */
	exports.JsonTransformRestFulParams = function(json){

		var restfulStr = "";
		for(k in json){
			restfulStr += "/" + k + "/" + json[k] + "/";
		}

		return restfulStr;

	};


	/**
	 * 判断一个对象是否为空
	 */
	exports.isNullObj = function(obj){
		for(var i in obj){
			if(obj.hasOwnProperty(i)){
				return false;
			}
		}
		return true;
	};


	/**
	 * 获取JSON数据中所有KEY组成的数组
	 */
	exports.getJsonKeyArray = function(obj){

		var tempArr = [];

		if(obj == undefined){
			return tempArr;
		}

		for(var k in obj){
				tempArr.push(k);
		}
		return tempArr;

	};

	/**
	 * 获取两个数组的差集
	 */
	exports.minus = function(arr1,arr2){
		var arr3 = [];
		for (var i = 0; i < arr1.length; i++) {
			var flag = true;
			for (var j = 0; j < arr2.length; j++) {
				if (arr2[j] == arr1[i]) {
					flag = false;
				}
			}
			if (flag) {
				arr3.push(arr1[i]);
			}
		}
		return arr3;
	}

	/**
	 * 数组中根据某个key排序
	 */
	exports.compare = function(key){
		return function(obj1, obj2) {
			var val1 = obj1[key],
					val2 = obj2[key]
			return val1 <= val2 ? -1 : 1
		}
	}



	/*
	 * 生成验证码
	 */
	exports.createCaptcha = function(){

		//导入验证码类库
		var ccap = require('ccap');

		//验证码格式设置
		var ccapObj = ccap({
			width:106,
			height:50,
			offset:25,
			quality:100,
			generate:function(){
				return common.getRandom(4);
			}
		});

		var ary = ccapObj.get();

		//验证码内容
		var txt = ary[0];

		//验证码图片
		var buf = ary[1];
		return [buf,txt];

	}

	/*
	 * 根据传递长度,获取随相应长度的随机数
	 */
	exports.getRandom = function (length) {
		var num = "";
		for (var i = 0; i < length; i++) {
			num = num + Math.floor(Math.random() * 10);
		}
		return num;
	}

	/*
	 * 获取当前年月日 格式 2012-12-12
	 */
	exports.getNowFormatDate = function(){

			var date = new Date();
			var seperator1 = "-";
			var seperator2 = ":";
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			var currentdate = year + seperator1 + month + seperator1 + strDate;
					// + " " + date.getHours() + seperator2 + date.getMinutes()
					// + seperator2 + date.getSeconds();
			return currentdate;

	}

	/*
	 * 阻塞测试
	 */
	exports.sleep = function(milliSeconds){
			var startTime = new Date().getTime(); 
    		while (new Date().getTime() < startTime + milliSeconds);
	}

	


}).call(this);

