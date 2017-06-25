exports.getVersion = function(req,res) {

    //获取restful参数
	var restful = req.routeInfo.restfulParams;

    var versionData = {};

    //构建任务流
    async.waterfall([

        //获取个人演奏集信息
        function(cb){

            db.where({"av_type":restful.type}).order("av_update_time desc").limit(0,1).select("mu_app_version",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"最新版本获取失败");
                }

                versionData = result[0];

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, versionData);
    });

}