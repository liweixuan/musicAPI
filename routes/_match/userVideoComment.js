exports.userVideoComment = function(req,res) {

    //获取restful参数
    var restfulParams = req.routeInfo.restfulParams;

    //当前时间戳
    var nowtime = common.nowTime(false);

    //拼接分页参数
    if(restfulParams.limit == undefined){
        restfulParams.limit = config.publicConfig.LIMIT;
    }

    if(restfulParams.skip == undefined){
         restfulParams.skip = 0;
    }

    var commentData = [];

    //构建任务流
    async.waterfall([

        //查询比赛详细信息
        function(cb){

            db.where({"mvc_mpuid":restfulParams.mvc_mpuid}).order("mvc_id desc").limit(restfulParams.skip,restfulParams.limit).select("v_match_video_comment_user",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"评论信息获取失败");
                }

                commentData = result;
                
                cb();


            });
        }

    ], function (err, result) {
        return RES.response(res, true,commentData);
    });

}