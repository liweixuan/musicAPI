exports.allLocation = function(req,res) {

	db.select("mu_location",function(result){

		if(result == 'ERROR'){
			return RES.response(res,false,"地址信息获取失败");
		}

		return RES.response(res,true,result);

	});

}