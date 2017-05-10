exports.response = function(res,isSuccess,data,routeInfo){


	//判断是否为GET请求，只有GET请求可以被缓存
	if(routeInfo != undefined && routeInfo.method == 'GET' && isSuccess) {

			//如果是数组的话，只对有数据的进行缓存
			if(data instanceof Array){

				if(data.length > 0){
					cache.setMemoryCache(routeInfo,data);
				}

			}else{
					cache.setMemoryCache(routeInfo,data);
			}
	}
	
	//结果返回
	if(isSuccess){
		res.send( { success : isSuccess, result : data } );
	}else{

		if(data.code == undefined){
			res.send( { success : isSuccess, error : { code : '8888' , message : data } } );
		}else{
			res.send( { success : isSuccess, error : data } );
		}
	}
};