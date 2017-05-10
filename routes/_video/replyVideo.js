exports.replyVideo = function(req,res) {

    //获取body参数
    var bodyParams = req.routeInfo.bodyParams;

    //构建任务流
    async.waterfall([

        function(cb){

            var addParams = {
                vc_content     : bodyParams.vc_content,
                vc_uid         : bodyParams.vc_uid,
                vc_vid         : bodyParams.vc_vid,
                vc_create_time : common.nowTime(false),
            } 

            db.add(addParams,"mu_video_comment",function(result){

                if(result == 'ERROR'){
                    return RES.response(res,false,"视频评论失败");
                }

                cb();

            });

        },

        //更新视频评论数量
        function(cb){

            db.where({v_id:bodyParams.vc_vid}).update({"v_comment_count" : "'v_comment_count' + 1"},"mu_video",function(result){
                cb();
            });
        }

    ], function (err, result) {
        return RES.response(res, true);
    });

}