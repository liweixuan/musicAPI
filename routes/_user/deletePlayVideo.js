exports.deletePlayVideo = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { upv_id : bodyParams.upv_id }; 

    //构建任务流
    async.waterfall([

        //为文章点赞
        function(cb){

            db.where(searchParams).update({"upv_is_delete":1},"mu_user_play_video",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"演奏视频删除失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}