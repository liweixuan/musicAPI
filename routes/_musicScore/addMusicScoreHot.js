exports.addMusicScoreHot = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { ms_id : bodyParams.ms_id }; 

    //构建任务流
    async.waterfall([

        //为评论点赞
        function(cb){

            db.where(searchParams).updateInc("ms_hot_count","mu_music_score",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"曲谱热度更新失败");
                }

                cb();
            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}