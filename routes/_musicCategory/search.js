exports.search = function(req,res) {

	var restful = req.routeInfo.restfulParams;

	if(restful.fid == undefined){
		restful.fid = 0;
	}

	if(restful.c_is_special == undefined){
		restful.c_is_special = 0;
	}

	if(restful.c_is_courses == undefined){
		restful.c_is_courses = 0;
	}

	db.where({"c_fid":restful.fid,"c_is_special":restful.c_is_special,"c_is_courses":restful.c_is_courses}).select("mu_category",function(result){

		if(result == 'ERROR'){
			return RES.response(res,false,"乐器类别获取失败");
		}

		return RES.response(res,true,result);

	});

}