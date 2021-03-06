exports.search = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //查询条件
    var searchParams = {};

    //判断是否增加视频类别查询
    if(restful.v_cid != undefined && restful.v_cid != 0){
       searchParams.v_cid = restful.v_cid;
    }
    //获取未删除的
    searchParams.v_is_delete = 0;

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

    var videoData = [];

    //构建任务流
    async.waterfall([

        //获取教师信息
        function(cb){

            db.field(fields).where(searchParams).limit(restful.skip,restful.limit).select("mu_video",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"音乐视频获取失败");
                }

                videoData = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, videoData);
    });

}