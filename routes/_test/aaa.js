exports.aaa = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    db.count("mu_activity",function(result){

        if(result == 'ERROR'){
            console.log('error');
            return RES.response(res,false,"活动信息获取失败");
        }

        return RES.response(res,true,result);


    });

   


}