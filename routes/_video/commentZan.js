exports.commentZan = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //条件
    var searchParams = { vc_id : bodyParams.vc_id }; 

    //构建任务流
    async.waterfall([

        //为评论点赞
        function(cb){

            db.where(searchParams).updateInc("vc_zan_count","mu_video_comment",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"视频评论点赞失败");
                }

                cb();

            });

        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}