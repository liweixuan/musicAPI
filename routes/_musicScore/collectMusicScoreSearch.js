exports.collectMusicScoreSearch = function(req,res) {

    //获取restful参数
	var restful    = req.routeInfo.restfulParams;

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //拼接分页参数
    if(restful.limit == undefined){
        restful.limit = config.publicConfig.LIMIT;
    }

    if(restful.skip == undefined){
         restful.skip = 0;
    }
    var musicScoreData = [];

    //构建任务流
    async.waterfall([

        //获取收藏的曲谱
        function(cb){

            db.where({"cms_uid":restful.u_id,ms_is_delete:0}).limit(restful.skip,restful.limit).select("v_collect_music_score_info",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"乐谱获取失败");
                }

                musicScoreData = result;

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true, musicScoreData);
    });

}