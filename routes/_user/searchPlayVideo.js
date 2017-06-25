exports.searchPlayVideo = function(req,res) {

    //获取restful参数
	var restful = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //拼接分页参数
    if(restful.limit == undefined){
        restful.limit = config.publicConfig.LIMIT;
    }

    if(restful.skip == undefined){
         restful.skip = 0;
    }

    //转化所需字段
    var fields = "";
    if(bodyParams != undefined && bodyParams.fields != undefined){

        //拼接字段显示字符串
        if(bodyParams.fields.length > 0){
            fields = bodyParams.fields.join(",");
        }
    }

    var playVideoData = [];

    //构建任务流
    async.waterfall([

        //获取个人演奏集信息
        function(cb){

            db.field(fields).order("upv_id desc").where({"upv_uid":restful.upv_uid,upv_is_delete:0}).limit(restful.skip,restful.limit).select("mu_user_play_video",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"个人演奏集获取失败");
                }

                playVideoData = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, playVideoData);
    });

}