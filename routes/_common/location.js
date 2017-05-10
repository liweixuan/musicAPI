exports.location = function(req,res) {

	var restful = req.routeInfo.restfulParams;
	
	if(restful.fid == undefined){
		 restful.fid = 0;
	}

	db.where({"l_fid":restful.fid}).select("mu_location",function(result){

		if(result == 'ERROR'){
			return RES.response(res,false,"省份信息获取失败");
		}

		return RES.response(res,true,result);

	});

}